import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from 'src/task.model';
import * as uuid from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTasksWithFilters(filterDTO: GetTasksFilterDto): Task[] {
    const { status, search } = filterDTO;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }
  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
    return found;
  }
  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      id: uuid.v1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  deleteTask(id: string) {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
  updateTaskStatus(id: string, data: CreateTaskDTO): Task {
    const found = this.getTaskById(id);
    const { title, description } = data;
    const taskUpdate: Task = {
      id: id,
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks = this.tasks.map((task) =>
      task.id === found.id ? taskUpdate : task,
    );
    return taskUpdate;
  }
}
