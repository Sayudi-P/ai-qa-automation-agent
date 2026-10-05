import { test, expect } from '@playwright/test';

test('AI QA Agent - intentional failure demo', async () => {
  test.skip(
    process.env.DEMO_FAILURE !== '1',
    'Demo failure disabled'
  );

  expect(true).toBe(false);
});
