export interface ITag {
  name: string;
  description: string;
}
export interface IResponse {
  [code: string]: {
    description: string;
  };
}
export interface IParameters {
  in: string;
  name: string;
  description?: string;
  type?: string;
  required: boolean;
  schema?: any;
}
export interface IMethod {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  requestBody: {
    description: string;
    name: string;
  };
  parameters: IParameters[];
  responses: IResponse[];
}
export interface IPath {
  [method: string]: IMethod[];
}
export interface IProperty {
  type: string;
  format: string;
}
export interface IProperties {
  type: string;
  description: string;
}
export interface IModel {
  type: string;
  properties: IProperty;
}
export interface IDefinitions {
  [model: string]: IModel;
}
export interface ISwagger {
  swagger: string;
  info: {
    description: string;
    version: string;
    title: string;
  };
  host: string;
  basePath: string;
  tags: ITag[];
  paths: IPath;
  definitions: IDefinitions;
}
