import * as _ from 'lodash';
import { classToPlain, plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor(private readonly dtoClass?: any) {
    console.log(
      '🚀 ~ file: transform.interceptor.ts ~ line 21 ~ constructor ~ dtoClass',
      dtoClass,
    );
  }

  tranform = (data: any) => {
    const dto: any = plainToClass(this.dtoClass, data, {
      excludeExtraneousValues: true,
    });

    const response: any = classToPlain(dto, { excludePrefixes: ['_'] });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  };

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map(this.tranform));
  }
}
