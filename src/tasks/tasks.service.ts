import { User } from './../auth/user.entity';
import { GetTasksFilterDTO } from './dto/get-tasks.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetUser } from 'src/auth/get-user.decorator';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  getTasks(
    filterDTO: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDTO, user);
  }
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterData: GetTasksFilterDTO): Task[] {
  //   const { status, search } = filterData;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) => task.title.includes(search) || task.status.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Cannot find ${id} in tasks`);
    }
    return found;
  }

  async createTask(createTaskDTO: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }
  async deleteTask(id: number, user: User): Promise<void> {
    const deleteAction = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (!deleteAction.affected) {
      throw new NotFoundException(`Cannot find ${id} in tasks`);
    }
  }
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();
    return task;
  }
}
