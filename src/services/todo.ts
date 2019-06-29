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
  Route,
  Summary
} from '../decorators/service';
import { Host, Tag } from '../decorators/swagger';

@Route('/todo')
@Host('localhost:3000')
@Tag('todo', 'Todo 模块')
export default class TodoService {
  @GET('/:id')
  findTodo(
    @Paramter(ParamterIn.Path, 'id', 'dididi', ParamterType.integer, true)
    id: string
  ) {
    return [id];
  }
  @DELETE('/:id')
  @Summary('delete a todo bu todoId')
  @Description('Returns a single todo')
  @Produces(ApplicationType.XML, ApplicationType.JSON)
  @Consumes(ApplicationType.FormData)
  deleteTodo(
    @Paramter(ParamterIn.Path, 'id', 'ididid', ParamterType.integer, true)
    id: string
  ) {
    return [id];
  }
  @POST('/')
  addTodo() {
    return [123];
  }
  @PUT('/')
  updateTodo() {
    return [123];
  }
}
