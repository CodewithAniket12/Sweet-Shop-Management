// __tests__/Dashboard.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import DashboardPage from '../src/pages/DashboardPage'; // This file doesn't exist yet

// This creates a fake server that will intercept our API calls during tests
const server = setupServer(
  rest.get('http://localhost:5001/api/sweets', (req, res, ctx) => {
    // We're telling it to return one fake sweet
    return res(ctx.json([{ _id: '1', name: 'Gulab Jamun', quantity: 10, category: 'Classic', price: 20 }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DashboardPage', () => {
  it('should fetch and display a list of sweets', async () => {
    render(<DashboardPage />);

    // The test will wait until it finds the text "Gulab Jamun" on the screen
    await waitFor(() => {
      expect(screen.getByText('Gulab Jamun')).toBeInTheDocument();
    });
  });
});