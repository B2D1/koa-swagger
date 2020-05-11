import { IMethod, IProperties } from '../interface/swagger';

export interface Method extends IMethod {
  subUrl: string;
  httpMethod: string;
  params: Param[];
}
export enum ParamterType {
  integer = 'integer',
  string = 'string',
  boolean = 'boolean',
  file = 'file',
}
export enum ParamFormat {
  date = 'date',
  dateTime = 'date-time',
  password = 'passsword',
  int32 = 'int32',
}
export enum ApplicationType {
  XML = 'application/xml',
  JSON = 'application/json',
  FormData = 'multipart/form-data',
}
export type Param = {
  desc: string;
  required: boolean;
  in: string;
  name: string;
  type: string;
  index: number;
  schema?: any;
};

export const getClazz: ClassDecorator = (target: any) =>
  (target.meta = target.meta || { baseUrl: '', routes: {} });
export const getMethod = (target: any, methodName: string): Method => {
  const meta = getClazz(target);
  const methodData =
    meta.routes[methodName] ||
    (meta.routes[methodName] = {
      subUrl: '',
      httpMethod: '',
      params: [],
    });
  return methodData;
};
export const Route = (baseUrl: string) => {
  return function (target: any) {
    const meta = getClazz(target.prototype);
    meta.baseUrl = baseUrl;
  };
};

enum HttpMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}

const methodFactory = (httpMethod: string) => {
  return (url: string) => {
    return (
      target: any,
      methodName: string,
      descripitor: PropertyDescriptor
    ) => {
      const meta = getMethod(target, methodName);
      meta.httpMethod = httpMethod;
      meta.subUrl = url;
      meta.params.sort(
        (param1: Param, param2: Param) => param1.index - param2.index
      );
    };
  };
};

export const GET = methodFactory(HttpMethod.GET);
export const POST = methodFactory(HttpMethod.POST);
export const DELETE = methodFactory(HttpMethod.DELETE);
export const PUT = methodFactory(HttpMethod.PUT);

export enum ParamterIn {
  Path = 'path',
  Query = 'query',
  FormData = 'formData',
  Header = 'header',
  Body = 'body',
}

type Obj = {
  properties: {
    [key: string]: Object;
  };
};
export const Paramter = (
  paramIn: string,
  paramName?: string,
  desc?: string,
  paramType?: string,
  required?: boolean
) => {
  return (target: any, methdName: string, paramIndex: number) => {
    const meta = getMethod(target, methdName);
    if (paramIn === ParamterIn.Body) {
      const obj: Obj = {
        properties: {},
      };
      obj.properties[paramName!] = {
        type: paramType,
        description: desc,
      };
      meta.params.push({
        name: paramName ? paramName : paramIn,
        index: paramIndex,
        type: paramType!,
        in: paramIn,
        desc: desc!,
        required: required!,
        schema: obj,
      });
    } else {
      meta.params.push({
        name: paramName ? paramName : paramIn,
        index: paramIndex,
        type: paramType!,
        in: paramIn,
        desc: desc!,
        required: required!,
      });
    }
  };
};

export interface ISchema {
  [name: string]: IProperties;
}

export const Summary = (summary: string) => {
  return (target: any, methdName: string) => {
    const meta = getClazz(target);
    const methodData: Method = meta.routes[methdName];
    methodData.summary = summary;
  };
};
export const Description = (desc: string) => {
  return (target: any, methdName: string) => {
    const meta = getClazz(target);
    const methodData: Method = meta.routes[methdName];
    methodData.description = desc || '';
  };
};
export const Produces = (...produces: ApplicationType[]) => {
  return (target: any, methdName: string) => {
    const meta = getClazz(target);
    const methodData: Method = meta.routes[methdName];
    methodData.produces = produces;
  };
};

export const Consumes = (...consumes: ApplicationType[]) => {
  return (target: any, methdName: string) => {
    const meta = getClazz(target);
    const methodData: Method = meta.routes[methdName];
    methodData.consumes = consumes;
  };
};

const ContextParamFactory = (paramType: string) => {
  return Paramter(paramType);
};

export const Ctx = ContextParamFactory('ctx');

export const RequestBody = (name: string, description: string) => {
  return (target: any, methdName: string) => {
    const meta = getClazz(target);
    const methodData: Method = meta.routes[methdName];
    methodData.requestBody = {
      name,
      description,
    };
  };
};
