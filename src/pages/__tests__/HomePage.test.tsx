import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';

describe('HomePage', () => {
  it('renders the login button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('link', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/auth');
  });
});
