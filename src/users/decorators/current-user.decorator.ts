import { createParamDecorator, ExecutionContext } from "@nestjs/common";

//creating a decorator in params to get the CurrentUser
export const CurrentUser = createParamDecorator(
    //context is request but of any communication protocol so it is not just called request (grpc,websocket, graphql,etc..)
    // type annotation of never means that this data won't ever be used
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
)