import express from "express";
import { viewQueue, userJoinQueue } from "../controller/queueController.js";
const QueueRouter = express.Router();
QueueRouter.get('/queue', viewQueue);
QueueRouter.post('/join', userJoinQueue);
export default QueueRouter;
