// src/setupTests.js
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// This runs a cleanup function after each test case
afterEach(() => {
  cleanup();
});