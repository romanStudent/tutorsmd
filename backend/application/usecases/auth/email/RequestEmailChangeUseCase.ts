import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { IEmailChangeRepository } from '../../../../domain/repositories/email/IEmailChangeRepository';
import { IEmailService } from '../../../ports/IEmailService';
import { IPasswordHasher } from '../../../ports/IPasswordHasher';
import { Email } from '../../../../domain/value-objects/Email';
import { DomainError } from '../../../../domain/errors/DomainError';
import { ConflictError } from '../../../../domain/errors/ConflictError';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { IEmailChangeTokenFactory } from '../../../ports/email/IEmailChangeTokenFactory';

export interface RequestEmailChangeDto {
  userId: string;
  newEmail: string;
  password: string;   // Без пароля злоумышленник вообще не может инициировать смену. Если у него есть только access token - этого недостаточно.
}

export class RequestEmailChangeUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailChangeRepo: IEmailChangeRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly emailService: IEmailService,
    private readonly tokenFactory: IEmailChangeTokenFactory,
  ) {}

  async execute(dto: RequestEmailChangeDto): Promise<void> {
    const newEmailVO = Email.create(dto.newEmail);

    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new NotFoundError('User not found');

    if (user.isOAuthUser()) {
      throw new DomainError('OAuth users cannot change email this way');
    }

    // Проверка пароля — обязательна для смены email
    const isValid = await this.passwordHasher.compare(dto.password, user.passwordHash!);
    if (!isValid) throw new DomainError('Incorrect password');

    if (user.email === newEmailVO.value) {
      throw new DomainError('New email is the same as current');
    }

    const taken = await this.userRepo.existsByEmail(newEmailVO.value);
    if (taken) throw new ConflictError('Email already in use');

   const { raw: confirmRaw, hash: confirmHash } = this.tokenFactory.generateEmailChangeToken();
   const { raw: oldConfirmRaw, hash: oldConfirmHash } = this.tokenFactory.generateEmailChangeToken();
   const { raw: cancelRaw,  hash: cancelHash  } = this.tokenFactory.generateEmailChangeToken();


    await this.emailChangeRepo.upsert({
      userId: dto.userId,
      newEmail: newEmailVO.value,
      tokenHash: confirmHash,
      oldConfirmHash: oldConfirmHash,
      cancelHash: cancelHash,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 часов
    });

    const confirmLink = `${process.env.CLIENT_URL}/email/change/${confirmRaw}`;
    const oldConfirmLink = `${process.env.CLIENT_URL}/email/confirm-old/${oldConfirmRaw}`;
    const cancelLink  = `${process.env.CLIENT_URL}/email/cancel/${cancelRaw}`;
    // на новый email
    await this.emailService.sendEmailChangeConfirmation(newEmailVO.value, confirmLink, user.languageCode);
    // на старый email
    // cancel link дает окно реакции в случае если пароль тоже скомпрометирован
    // после смены email отзываем все сессии
    await this.emailService.sendEmailChangeNotification(user.email, oldConfirmLink, cancelLink, user.languageCode);
  }
}