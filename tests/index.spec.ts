import { test, expect } from 'vitest';
import { formatURL, removeTrailingEndSlash } from '../src/utils';

test('format url correctly', () => {
  const result = formatURL('https://hello.com/', '/abs');
  console.log('[result]: ', result);
  expect(result).toBe('https://hello.com/abs');
});

test('format url correctly', () => {
  const result = formatURL('/test', 'https://hello.com/');
  console.log('[result]: ', result);
  expect(result).toBe('https://hello.com');
});

test('should remove trailing end slash', () => {
  const result = removeTrailingEndSlash('http://test.app/');
  console.log('[result]: ', result);
  expect(result).toBe('http://test.app');
});

test('should not do anything', () => {
  const result = removeTrailingEndSlash('http://test.app');
  console.log('[result]: ', result);
  expect(result).toBe('http://test.app');
});
