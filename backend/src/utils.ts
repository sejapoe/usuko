export function generatePassword(): string {
  const length = 8,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export class ScreenedRegExp extends RegExp {
  constructor(pattern: string, flags?: string | undefined) {
    // pattern = pattern.replace(/[\.\(\)\[\]\|\{\}\*\+\?\^\$\/\-\\]/g, '\\$');

    if (flags) {
      super(pattern, flags);
    } else {
      super(pattern);
    }
  }
}
