import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRespository: TaskRepository,
  ) {}
  getAllTasks(): Promise<Task[]> {
    return this.taskRespository.find();
  }
  async getTasks(filterDTO: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRespository.getTasks(filterDTO);
  }
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRespository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
    return found;
  }
  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRespository.createTask(createTaskDTO);
  }
  async deleteTAsk(id: number): Promise<void> {
    const found = this.taskRespository.findOne(id);
    if (found) {
      this.taskRespository.delete(id);
    }
  }
  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with id ${id} not found.`);
  //   }
  //   return found;
  // }
  // deleteTask(id: string) {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
  // updateTaskStatus(id: string, data: CreateTaskDTO): Task {
  //   const found = this.getTaskById(id);
  //   const { title, description } = data;
  //   const taskUpdate: Task = {
  //     id: id,
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks = this.tasks.map((task) =>
  //     task.id === found.id ? taskUpdate : task,
  //   );
  //   return taskUpdate;
  // }
}
