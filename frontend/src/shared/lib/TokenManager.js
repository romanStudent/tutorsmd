let _accessToken = null;
export const tokenManager = {
    get() { return _accessToken; },
    set(token) { _accessToken = token; },
    clear() { _accessToken = null; },
};
