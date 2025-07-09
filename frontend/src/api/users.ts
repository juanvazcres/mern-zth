const API_URL = 'http://localhost:5000/api/users';

export async function getUsers() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function createUser(user: { name: string; email: string; password: string }) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return res.json();
}
