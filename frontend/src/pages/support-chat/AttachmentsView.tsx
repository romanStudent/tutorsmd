import { SupportAttachment } from "@shared/api/supportApi";

export const AttachmentView = ({ attachment, isOwn }: { attachment: SupportAttachment; isOwn: boolean }) => {
  const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(attachment.name) ||
    attachment.mimeType?.startsWith('image/');
  const isPdf = attachment.mimeType === 'application/pdf' || /\.pdf$/i.test(attachment.name);
  const url = attachment.url || attachment.key;

  console.log(attachment);

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[200px]">
        <img src={url} alt={attachment.name} className="max-w-[200px] rounded-xl object-cover" loading="lazy" />
        <p className={`text-xs mt-1 truncate ${isOwn ? 'opacity-70' : 'text-slate-400'}`}>{attachment.name}</p>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className={`flex items-center gap-2 text-xs underline underline-offset-2 ${isOwn ? 'text-blue-100 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
      <span>{isPdf ? '📄' : '📎'}</span>
      <span className="truncate max-w-[160px]">{attachment.name}</span>
      {attachment.size && <span className="opacity-60">({Math.round(attachment.size / 1024)} KB)</span>}
    </a>
  );
};