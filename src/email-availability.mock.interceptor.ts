import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

/** Same artificial latency as `checkUsernameAvailability` so pending UI is visible. */
const MOCK_LATENCY_MS = 2500;

/** Demo-only: replace with a real backend; swap this interceptor for nothing in production. */
const EMAIL_ALREADY_REGISTERED = new Set(
  ['test@email.com'].map(e => e.toLowerCase()),
);

const AVAILABILITY_PATH = '/api/v1/signup/email-availability';

function emailFromRequestUrl(url: string): string {
  try {
    const parsed = url.startsWith('http') ? new URL(url) : new URL(url, 'http://local');
    return (parsed.searchParams.get('email') ?? '').trim().toLowerCase();
  } catch {
    return '';
  }
}

export const emailAvailabilityMockInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.url.includes(AVAILABILITY_PATH)) {
    return next(req);
  }
  const email = emailFromRequestUrl(req.url);
  const available = email.length > 0 && !EMAIL_ALREADY_REGISTERED.has(email);
  return of(
    new HttpResponse({
      status: 200,
      body: { available },
    }),
  ).pipe(delay(MOCK_LATENCY_MS));
};
