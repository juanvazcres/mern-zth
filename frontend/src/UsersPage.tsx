import { useEffect, useState } from 'react';
import { getUsers, createUser } from './api/users';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createUser(form);
    if (res.user) setUsers((prev) => [...prev, res.user]);
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
}
