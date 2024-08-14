import { describe, test, jest, beforeEach, afterEach } from '@jest/globals';
import { deleteCookie, getCookie, setCookie } from './cookie';

describe('getCookie', () => {
  beforeEach(() => {
    document.cookie = 'testCookie=testValue';
  });

  afterEach(() => {
    document.cookie = 'testCookie=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });

  test('Тест - должен возвращать корректное значение', () => {
    const result = getCookie('testCookie');
    expect(result).toBe('testValue');
  });

  test('Тест - должен возвращать undefined, если cookie не существует', () => {
    const result = getCookie('nonExistentCookie');
    expect(result).toBeUndefined();
  });

  test('Тест - должен обрабатывать специальные символы', () => {
    document.cookie = 'test.Special=encodedValue';
    const result = getCookie('test.Special');
    expect(result).toBe('encodedValue');
  });
});

describe('setCookie', () => {
  afterEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });
  });

  test('Тест - устанавливает корректное значение', () => {
    setCookie('newCookie', 'newValue');
    expect(document.cookie).toContain('newCookie=newValue');
  });

  test('Тест - установка cookie с сроком действия', () => {
    setCookie('temporaryCookie', 'temporaryValue', { expires: 3600 });
    expect(document.cookie).toContain('temporaryCookie=temporaryValue');
  });
});

describe('deleteCookie', () => {
  beforeEach(() => {
    setCookie('cookieToDelete', 'valueToDelete');
  });

  test('Тест - удаляет cookie по ключу', () => {
    deleteCookie('cookieToDelete');
    expect(document.cookie).not.toContain('cookieToDelete=valueToDelete');
  });

  test('Тест - удаление одного cookie не должен влиять на другой', () => {
    setCookie('anotherCookie', 'anotherValue');
    deleteCookie('cookieToDelete');
    expect(document.cookie).toContain('anotherCookie=anotherValue');
    expect(document.cookie).not.toContain('cookieToDelete=valueToDelete');
  });
});
