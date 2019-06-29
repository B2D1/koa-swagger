import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Static from 'koa-static';
import * as path from 'path';

import TodoService from './services/todo';
import UserService from './services/user';
import { registerService } from './utils/register';

const app = new Koa();
const swaggerConfig = {
  swagger: '2.0',
  tags: [],
  host: 'localhost:3000',
  paths: {},
  info: { description: 'Swagger文档', version: '1.0.0', title: 'Koa-server' }
};
app.use(bodyParser());

registerService(app, [UserService, TodoService], swaggerConfig);
// 静态资源目录对于相对入口文件index.js的路径
const staticPath = '../public';

app.use(Static(path.join(__dirname, staticPath)));

app.listen(3000, () => {
  console.log(`server is running!`);
});
