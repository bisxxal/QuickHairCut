import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import QueueRouter from "./router/queueRouter.js";
import { initSocket } from "./socket/index.js";

const app = express();
dotenv.config();

const httpServer = createServer(app);
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://quickhaircut.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api',QueueRouter);

const PORT = process.env.PORT || 8000;

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});