import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

//this will ensure that whatever is passed will always be a Class, So we now don't have to use type (any)
interface ClassConstructor {
    new(...args: any[]): {}
}

// Using the classConstructor to ensure the dto to be a class
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) { }
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run before request is handled by request handler
        // console.log("running before handler", context);
        return handler.handle().pipe(
            map((data: ClassConstructor) => {
                //run before the response is sent out
                // console.log("running before response is sent out", data);
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}