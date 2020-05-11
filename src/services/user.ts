import { File } from 'koa-multer';

import {
  ApplicationType,
  Consumes,
  DELETE,
  Description,
  GET,
  Paramter,
  ParamterIn,
  ParamterType,
  POST,
  Produces,
  PUT,
  RequestBody,
  Route,
  Summary,
} from '../decorators/service';
import { Tag } from '../decorators/swagger';

@Route('/user')
@Tag('user', '用户模块')
export default class UserService {
  @GET('/:id')
  @Summary('通过用户 ID 查询用户')
  @Description('返回一个用户模型')
  findUser(
    @Paramter(ParamterIn.Path, 'id', '用户 ID', ParamterType.integer, true)
    id: number
  ) {
    return { userId: id + 1 };
  }
  @DELETE('/:id')
  @Summary('通过用户 ID 删除用户')
  @Produces(ApplicationType.JSON)
  @Consumes(ApplicationType.FormData)
  deleteUser(
    @Paramter(ParamterIn.Header, 'api_key', '', ParamterType.string, false)
    api_key: string,
    @Paramter(ParamterIn.Path, 'id', '用户 ID', ParamterType.integer, true)
    id: number
  ) {
    return { userId: id, api_key };
  }
  @POST('/')
  @Summary('增加新用户')
  @RequestBody('body', '需要被添加的用户实体')
  addUser(
    @Paramter(ParamterIn.Body, 'usr', 'the username', ParamterType.string, true)
    usr: string,
    @Paramter(ParamterIn.Body, 'psd', 'the password', ParamterType.string, true)
    psd: string
  ) {
    return { usr, psd };
  }
  @PUT('/')
  @Summary('更新用户')
  @RequestBody('body', '需要被更新的用户实体')
  updateUser(
    @Paramter(ParamterIn.Body, 'usr', 'the username', ParamterType.string, true)
    usr: string,
    @Paramter(ParamterIn.Body, 'psd', 'the password', ParamterType.string, true)
    psd: string
  ) {
    return { usr, psd };
  }
  @POST('/:id')
  @Summary('通过 Form-data 更新用户')
  updateUserWithForm(
    @Paramter(
      ParamterIn.Path,
      'id',
      '要更新的用户 ID',
      ParamterType.integer,
      true
    )
    id: number,
    @Paramter(
      ParamterIn.FormData,
      'usr',
      '更新后的用户名',
      ParamterType.string,
      false
    )
    usr: string,
    @Paramter(
      ParamterIn.FormData,
      'psd',
      '更新后的密码',
      ParamterType.string,
      false
    )
    psd: string
  ) {
    return { id, usr, psd };
  }
  @POST('/:id/uploadImage')
  @Summary('更新用户头像')
  uploadFile(
    @Paramter(
      ParamterIn.Path,
      'id',
      '要更新的用户 ID',
      ParamterType.integer,
      true
    )
    id: number,
    @Paramter(
      ParamterIn.FormData,
      'file1',
      '要上传的文件①',
      ParamterType.file,
      false
    )
    file1: File,
    @Paramter(
      ParamterIn.FormData,
      'file2',
      '要上传的文件②',
      ParamterType.file,
      false
    )
    file2: File
  ) {
    return { id, file1, file2 };
  }
}
