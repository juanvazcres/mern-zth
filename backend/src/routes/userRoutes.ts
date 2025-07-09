import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

router.get('/', async (_req, res) => {
    const users = await User.find().select('-password'); // no password in response
    res.json(users);
});

router.post('/', async (req, res) => {
    const {body: { name, email, password }} = req;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created', user: { name, email, _id: user._id } });
    } catch (err) {
        if ((err as any).code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error creating user' });
    }
});

export default router;
