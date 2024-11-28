import xss from 'xss';

export const sanitizeInput = (input: string): string => {
  return xss(input.trim());
};

export const validatePassword = (password: string): boolean => {
  // En az 8 karakter, bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const rateLimiter = (() => {
  const attempts = new Map<string, { count: number; timestamp: number }>();
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 dakika

  return {
    checkLimit: (ip: string): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(ip);

      if (!userAttempts) {
        attempts.set(ip, { count: 1, timestamp: now });
        return true;
      }

      if (now - userAttempts.timestamp > WINDOW_MS) {
        attempts.set(ip, { count: 1, timestamp: now });
        return true;
      }

      if (userAttempts.count >= MAX_ATTEMPTS) {
        return false;
      }

      attempts.set(ip, {
        count: userAttempts.count + 1,
        timestamp: userAttempts.timestamp,
      });
      return true;
    },
    resetLimit: (ip: string): void => {
      attempts.delete(ip);
    },
  };
})();