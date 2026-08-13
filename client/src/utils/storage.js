/**
 * Versioned, guarded localStorage access with an in-memory cache.
 *
 * Why (Vercel React best practices):
 *  - `client-localstorage-schema`: keys carry an `evx:` version prefix so schema
 *    evolution is possible; legacy unversioned keys are migrated once.
 *  - `js-cache-storage`: getItem/setItem are synchronous and expensive; the auth
 *    token is cached in memory so the axios interceptor never touches storage
 *    per request.
 *  - Every read/write is try/catch-guarded (private browsing, quota, disabled).
 */

const PREFIX = 'evx:';

const KEYS = {
    theme: `${PREFIX}theme`,
    token: `${PREFIX}token`,
    user: `${PREFIX}user`,
};

/* Legacy unversioned keys, migrated to the prefixed keys on first read. */
const LEGACY_KEYS = {
    theme: 'eventrix-theme',
    token: 'token',
    user: 'userInfo',
};

const read = (key) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* storage unavailable — ignore */
    }
};

const remove = (key) => {
    try {
        localStorage.removeItem(key);
    } catch {
        /* storage unavailable — ignore */
    }
};

/* Move a legacy value to its versioned key exactly once. */
const migrate = (name) => {
    const legacyKey = LEGACY_KEYS[name];
    if (!legacyKey) return;
    if (read(KEYS[name]) !== null) return; // already migrated
    const raw = read(legacyKey);
    if (raw === null) return;
    write(KEYS[name], raw);
    remove(legacyKey);
};

export const themeStorage = {
    get() {
        migrate('theme');
        return read(KEYS.theme);
    },
    set(value) {
        write(KEYS.theme, value);
    },
};

/* --- Auth token: cached in memory, read from storage exactly once --- */
let cachedToken = null;
let tokenLoaded = false;

export const authStorage = {
    getToken() {
        if (!tokenLoaded) {
            migrate('token');
            cachedToken = read(KEYS.token);
            tokenLoaded = true;
        }
        return cachedToken;
    },
    setToken(value) {
        cachedToken = value;
        tokenLoaded = true;
        write(KEYS.token, value);
    },
    clearToken() {
        cachedToken = null;
        tokenLoaded = true;
        remove(KEYS.token);
    },
    getUser() {
        migrate('user');
        const raw = read(KEYS.user);
        if (raw === null) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null; // corrupt payload must never crash the app at boot
        }
    },
    setUser(user) {
        write(KEYS.user, JSON.stringify(user));
    },
    clearUser() {
        remove(KEYS.user);
    },
};
