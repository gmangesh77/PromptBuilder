const ALLOWED_ORIGINS_ENV = process.env.ALLOWED_ORIGINS;

function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  if (ALLOWED_ORIGINS_ENV) {
    origins.push(
      ...ALLOWED_ORIGINS_ENV.split(',').map((o) => o.trim()),
    );
  }

  // VERCEL_URL = deployment-specific URL (e.g. app-abc123.vercel.app)
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    origins.push(`https://${vercelUrl}`);
  }

  // VERCEL_PROJECT_PRODUCTION_URL = production alias (e.g. app-nu.vercel.app)
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl) {
    origins.push(`https://${vercelProdUrl}`);
  }

  return origins;
}

function isLocalhost(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export function checkOrigin(request: Request): boolean {
  const allowed = getAllowedOrigins();

  // If no origins configured (e.g., initial setup), allow all
  if (allowed.length === 0) return true;

  const origin = request.headers.get('origin');

  // Allow any localhost port in development
  if (origin && process.env.NODE_ENV !== 'production' && isLocalhost(origin)) {
    return true;
  }

  if (origin && allowed.includes(origin)) return true;

  // Fallback: check Referer header
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowed.includes(refererOrigin);
    } catch {
      return false;
    }
  }

  return false;
}
