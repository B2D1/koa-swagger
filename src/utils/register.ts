import * as fs from 'fs';
import { IncomingMessage as OriginalIM } from 'http';
import { Context } from 'koa';
import * as multer from 'koa-multer';
import * as Router from 'koa-router';
import * as path from 'path';

import { getClazz, Method, Param, ParamterIn } from '../decorators/service';
import { getDocs } from '../decorators/swagger';
import { IMethod, IParameters, ISwagger } from '../interface/swagger';
import { File, MulterIncomingMessage, Field } from 'koa-multer';

var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split('.'); //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
  }
});

var upload = multer({ storage: storage });
function extractParameters(ctx: Context, params: Param[]) {
  const args = <any>[];
  if (!params) return;
  const paramsMap = {
    path: (paramName: string) => ctx.params[paramName],
    query: (paramName: string) => ctx.query[paramName],
    body: (paramName: string) => ctx.request.body[paramName],
    header: (paramName: string) => ctx.headers[paramName],
    formData: (paramName: string, paramType: string) => {
      const req = ctx.req as MulterIncomingMessage;
      return paramType !== 'file'
        ? ctx.request.body[paramName]
        : req.files[paramName];
    },
    ctx: () => ctx
  };
  params.forEach((param) => {
    args.push(paramsMap[param.in](param.name, param.type));
  });
  return args;
}
const urlParse = (url: string) => {
  return url
    .replace(/\:(\w+)/, function($1) {
      let arr = $1.split('');
      arr.shift();
      return '{' + arr.join('') + '}';
    })
    .replace(/\/$/, '');
};
const handlePath = (target, prefix: string, meta: Method) => {
  const docs: ISwagger = getDocs(target);
  const parseUrl = urlParse(prefix + meta.subUrl);
  const route = (docs.paths[parseUrl] = docs.paths[parseUrl] || {});
  const method: IMethod = (route[meta.httpMethod] =
    route[meta.httpMethod] || {});
  const tags = (method.tags = method.tags || []);
  tags.push(prefix.substring(1));
  method.parameters = [];
  const requestBody = meta.requestBody || {};
  meta.params.forEach((param) => {
    if (param.in === 'ctx') {
      return;
    }
    let paramter: IParameters;
    if (param.in === ParamterIn.Body) {
      const hasBody = method.parameters.findIndex(
        (v) => v.in == ParamterIn.Body
      );
      if (hasBody > -1) {
        method.parameters[hasBody].schema.properties[param.name] = {
          type: param.type,
          description: param.desc
        };
      } else {
        paramter = {
          in: param.in,
          name: requestBody.name,
          required: param.required,
          description: requestBody.description,
          schema: param.schema
        };
        method.parameters.push(paramter);
      }
    } else {
      paramter = {
        in: param.in,
        name: param.name,
        required: param.required,
        type: param.type,
        description: param.desc
      };
      method.parameters.push(paramter);
    }
  });
  method.consumes = meta.consumes;
  method.produces = meta.produces;
  method.description = meta.description;
  method.summary = meta.summary;
  method.responses = [];
};
export function registerService(app, serviceClazzes: any[], config: any) {
  let swaggerDoc: ISwagger;
  swaggerDoc = config;
  serviceClazzes.forEach((ServiceClazz) => {
    const router = new Router();
    const meta = getClazz(ServiceClazz.prototype);
    const serviceInstance = new ServiceClazz();
    const routes = meta.routes;
    const prefix = meta.baseUrl;
    for (const methodName in routes) {
      const methodData: Method = routes[methodName];
      const httpMethod = methodData.httpMethod;
      handlePath(ServiceClazz.prototype, prefix, methodData);
      const docs: ISwagger = getDocs(ServiceClazz.prototype);
      for (let path in docs.paths) {
        swaggerDoc.paths[path] = docs.paths[path];
      }
      const fn = (ctx: Context, next: Function) => {
        const params = extractParameters(ctx, methodData['params']);
        const result = ServiceClazz.prototype[methodName].apply(
          serviceInstance,
          params
        );
        if (result !== undefined) {
          if (!ctx.headerSent) {
            ctx.body = result;
          }
        }
      };

      let params: any[] = [methodData.subUrl];
      const method: Method = routes[methodName];
      let files: Field[] = [];
      method.params.forEach((v) => {
        const fileIndex = v.type === 'file';
        if (fileIndex) {
          files.push({ name: v.name });
        }
      });
      params.push(upload.fields(files));
      params.push(fn);
      router[httpMethod](...params);
    }
    swaggerDoc.tags = swaggerDoc.tags.concat(ServiceClazz.prototype.docs.tags);
    fs.exists(path.resolve(__dirname, '../../public', 'koa.json'), (exists) => {
      if (exists) {
        fs.unlink(path.join(__dirname, '../../public', 'koa.json'), (err) => {
          if (err) return;
          fs.writeFile(
            path.resolve(__dirname, '../../public', 'koa.json'),
            JSON.stringify(swaggerDoc),
            (err) => {
              if (err) throw err;
            }
          );
        });
      } else {
        fs.writeFile(
          path.resolve(__dirname, '../../public', 'koa.json'),
          JSON.stringify(swaggerDoc),
          (err) => {
            if (err) throw err;
          }
        );
      }
    });

    router.prefix(meta.baseUrl);
    app.use(router.routes());
    app.use(router.allowedMethods());
  });
}
