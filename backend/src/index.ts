import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { accountRouter } from './routes/account';
import { refundRouter } from './routes/refund';
import { tsxnRouter } from './routes/transaction';
import { userRouter } from './routes/user';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();
app.use('/*', cors());
app.route('/api/auth', userRouter);
app.route('/api/transactions/', tsxnRouter);
app.route('/api/account', accountRouter);
app.route('/api/refunds', refundRouter);

export default app
