import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import User from '../models/User';

let mongod: MongoMemoryServer;
let app: express.Express;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = express();
  app.use(express.json());
  app.use('/api/users', userRoutes);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

test('should create a new user', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'Test', email: 'test@example.com', password: '123456' });
  expect(res.statusCode).toBe(201);
  expect(res.body.user).toHaveProperty('_id');
  expect(res.body.user.name).toBe('Test');
});

test('should list users', async () => {
  await User.create({ name: 'A', email: 'a@example.com', password: 'pw' });
  const res = await request(app).get('/api/users');
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('A');
});
