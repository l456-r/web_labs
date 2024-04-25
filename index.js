import express from 'express';
import bodyParser from 'body-parser';
import { OrdersRouter } from './routers/index.js';
import {  UsersRouter} from './routers/users.router.js'

const app = express();
app.use(bodyParser.json());
app.use(OrdersRouter);
app.use(UsersRouter);
app.listen(8080, () => console.log('Server was started'));