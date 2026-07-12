// Direct client to the Anti-Kuddus AI service on Railway.
// Endpoints are fixed by the provider — don't invent new ones here.
// Env override: VITE_AKP_API_URL (no trailing slash).

const RAW_BASE =
  import.meta.env.VITE_AKP_API_URL || 'https://skibidikudus.up.railway.app';
export const AKP_API_BASE = RAW_BASE.replace(/\/$/, '');

export class AkpApiError extends Error {
  constructor(message, { status = 0, code = 'error', fieldErrors = null, raw = null } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors; // { fieldName: 'msg' } when 422
    this.raw = raw;
  }
}

// FastAPI 422 shape:
// { detail: [{ loc: (string|number)[], msg: string, type: string, input?: unknown, ctx?: object }] }
function parseValidationError(payload) {
  const items = Array.isArray(payload?.detail) ? payload.detail : [];
  const fieldErrors = {};
  const messages = [];
  for (const item of items) {
    const loc = Array.isArray(item?.loc) ? item.loc : [];
    // Drop leading 'body' / 'query' segment for a cleaner field name.
    const field = loc.filter((p) => p !== 'body' && p !== 'query').join('.') || 'input';
    const msg = item?.msg || 'Invalid value';
    fieldErrors[field] = msg;
    messages.push(`${field}: ${msg}`);
  }
  return {
    message: messages.join(' · ') || 'Validation failed',
    fieldErrors,
  };
}

export async function akpFetch(path, { method = 'GET', body, signal, headers = {} } = {}) {
  const url = `${AKP_API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body != null ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
    throw new AkpApiError('Network error — could not reach AI service.', { code: 'network' });
  }

  let payload = null;
  try { payload = await res.json(); } catch { /* non-json */ }

  if (res.ok) return payload;

  if (res.status === 422) {
    const { message, fieldErrors } = parseValidationError(payload);
    throw new AkpApiError(message, { status: 422, code: 'validation', fieldErrors, raw: payload });
  }

  const msg =
    (typeof payload?.detail === 'string' && payload.detail) ||
    payload?.message ||
    `Request failed (${res.status})`;
  throw new AkpApiError(msg, { status: res.status, code: 'http', raw: payload });
}
