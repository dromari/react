import { describe, it, expect } from 'vitest';
import {
  validateEmailNoRegex,
  checkPasswordStrength,
  convertToBase64,
} from '../shared/utils';
import { createFormSchema } from '../shared/validationSchema';

describe('Utility Functions & Validation Helpers', () => {
  describe('convertToBase64', () => {
    it('should successfully convert a File to base64 string', async () => {
      const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

      const result = await convertToBase64(file);

      expect(result).toContain('data:text/plain;base64,');
      expect(result).toBe('data:text/plain;base64,aGVsbG8=');
    });

    it('should reject the promise when FileReader throws an error', async () => {
      const file = new File([''], 'corrupted.txt');

      const originalRead = FileReader.prototype.readAsDataURL;

      FileReader.prototype.readAsDataURL = function (this: FileReader) {
        setTimeout(() => {
          if (this.onerror) {
            const fakeError = new Error('Mocked FileReader error');
            this.onerror({
              target: { error: fakeError },
            } as unknown as ProgressEvent<FileReader>);
          }
        }, 0);
      };

      await expect(convertToBase64(file)).rejects.toBeDefined();

      FileReader.prototype.readAsDataURL = originalRead;
    });
  });

  describe('validateEmailNoRegex', () => {
    it('should correctly validate emails without RegExp', () => {
      expect(validateEmailNoRegex('test@example.com')).toBe(true);
      expect(validateEmailNoRegex('invalid-email')).toBe(false);
      expect(validateEmailNoRegex('test@com')).toBe(false);
      expect(validateEmailNoRegex('')).toBe(false);
      expect(validateEmailNoRegex('@domain.com')).toBe(false);
      expect(validateEmailNoRegex('test@.com')).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should correctly calculate password complexity', () => {
      expect(checkPasswordStrength('1234').score).toBe(1);
      expect(checkPasswordStrength('Pas1!').score).toBe(4);
      const weak = checkPasswordStrength('abc');
      expect(weak.hasLower).toBe(true);
      expect(weak.hasUpper).toBe(false);
      expect(weak.score).toBe(1);
    });
  });

  describe('Zod schema validation', () => {
    it('Zod schema must require the first letter in the name to be capitalized', () => {
      const schema = createFormSchema(['USA']);

      const valid = schema.safeParse({
        name: 'Ivan',
        age: 20,
        email: 'i@test.com',
        gender: 'male',
        country: 'USA',
        password: 'pass',
        confirmPassword: 'pass',
        terms: true,
      });
      expect(valid.success).toBe(true);

      const invalid = schema.safeParse({ name: 'ivan' });
      expect(invalid.success).toBe(false);
    });
  });
});
