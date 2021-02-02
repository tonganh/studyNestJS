import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Task, TaskStatus } from 'src/task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(@Query(ValidationPipe) filterDTO: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDTO).length) {
      return this.tasksService.getTasksWithFilters(filterDTO);
    }
    return this.tasksService.getAllTasks();
  }
  @Get('/:id')
  getTaskByID(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }
  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id')
  updateTAskSstatus(
    @Param('id') id: string,
    @Body(new TaskStatusValidationPipe()) data: CreateTaskDTO,
  ): Task {
    return this.tasksService.updateTaskStatus(id, data);
  }
}
