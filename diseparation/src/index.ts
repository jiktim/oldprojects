import * as express from 'express';
import * as Journl from 'journl';
import apiRouter from './api/router';
import vueRouter from './views/router';
import config from './config';

export const log = new Journl();
export const app = express();

app.use('/api/v1', apiRouter());
app.use('/', vueRouter());
app.listen(config.port, () => log.success('Listening on port ' + config.port));
