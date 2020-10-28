import * as express from 'express';
import authRouter from './auth';

export default function router(): express.Router {
  const r = express.Router();
  r.use("/auth", authRouter());
  return r;
}