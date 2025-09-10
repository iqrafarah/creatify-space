import { cookies} from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "sess";
const SECRET = process.env.SESSION_SECRET;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64url(buf) {
    return Buffer.from(buf).toString("base64url");
}

function sign(data) {
    const h = crypto.createHmac("sha256", SECRET).update(data).digest();
    return base64url(h);
}

export function createSessionCookie(userId) {
    const payload = JSON.stringify({sub: userId, iat: Date.now()});
    const b = base64url(payload);
    const s = sign(b);
    const value = `${b}.${s}`;

    return {
        name: COOKIE_NAME,
        value,
        options: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: MAX_AGE_SECONDS
        },
    };
}

export function verifySessionCookie() {
    const store = cookies();
    const raw = store.get(COOKIE_NAME)?.value;
    if (!raw) return null;

    const [b, s] = raw.split(".");
    if (!b || !s) return null;
    if (sign(b) !== s) return null;

    try {
        const json = JSON.parse(Buffer.from(b, "base64url").toString("utf8"));
        return json?.sub || null;
    } catch {
        return null;    
    }
}


export function clearSessionCookie() {
    return {
        name: COOKIE_NAME,
        value: "",
        options: { path: "/", maxAge: 0},
    };
}