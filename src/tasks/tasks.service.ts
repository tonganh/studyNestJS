import { GetTasksFilterDTO } from './dto/get-tasks.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
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

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Cannot find ${id} in tasks`);
    }
    return found;
  }

  async createTask(createTaskDTO: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO);
  }
  async deleteTask(id: number): Promise<void> {
    const deleteAction = await this.taskRepository.delete(id);
    if (!deleteAction.affected) {
      throw new NotFoundException(`Cannot find ${id} in tasks`);
    }
  }
  // updateTaskStatus(id: string, status: TaskStatus): void {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   // this.tasks = this.tasks.map((task) => {
  //   //   if (task.id === id) {
  //   //     task.status = status;
  //   //   }
  //   //   return task;
  //   // });
  // }
}
