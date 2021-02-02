import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from 'src/task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any) {
    console.log(value);
    value = value.status.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatus.indexOf(status);
    return idx !== -1;
  }
}
