import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRefreshMutation } from '@shared/api/authApi';
import { setCredentials, clearCredentials } from '@entities/user/model/authSlice';
import { tokenManager } from '@shared/lib/TokenManager';
import { jwtDecode } from 'jwt-decode';
export const useInitAuth = () => {
    const dispatch = useDispatch();
    const [refresh] = useRefreshMutation();
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const init = async () => {
            try {
                const data = await refresh({}).unwrap();
                tokenManager.set(data.accessToken);
                const payload = jwtDecode(data.accessToken);
                dispatch(setCredentials({
                    userId: payload.userId,
                    activeRole: payload.activeRole,
                }));
            }
            catch {
                // Нет валидного refreshToken — не залогинен
                tokenManager.clear();
                dispatch(clearCredentials());
            }
            finally {
                setIsReady(true);
            }
        };
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return { isReady };
};
