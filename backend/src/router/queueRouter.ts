import express, { Router } from "express";
import { viewQueue,userJoinQueue } from "../controller/queueController.js";

const QueueRouter: Router = express.Router();

QueueRouter.get('/queue',viewQueue);
QueueRouter.post('/join',userJoinQueue);

export default QueueRouter;