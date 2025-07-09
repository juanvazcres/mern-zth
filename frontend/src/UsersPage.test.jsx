import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsersPage from './UsersPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const users = [
  { _id: '1', name: 'Juan', email: 'juan@mail.com' },
];

const server = setupServer(
  rest.get('http://localhost:5000/api/users', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(users))
  ),
  rest.post('http://localhost:5000/api/users', (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ user: { _id: '2', ...(req.body) } }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders user list', async () => {
  render(<UsersPage />);
  expect(await screen.findByText(/juan/i)).toBeInTheDocument();
});

test('creates a new user', async () => {
  render(<UsersPage />);
  fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Pedro' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'pedro@mail.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });
  fireEvent.click(screen.getByText(/add/i));
  await waitFor(() => expect(screen.getByText(/pedro/i)).toBeInTheDocument());
});
