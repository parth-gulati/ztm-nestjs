import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepository: TaskRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.create(createTaskDto);
  }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((x) => x.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       (x) => x.description.includes(search) || x.title.includes(search),
  //     );
  //   }

  //   return tasks;
  // }

  async deleteTaskById(id: string): Promise<void> {
    const found = await this.tasksRepository.deleteTaskById(id);

    if (found.affected === 0) {
      throw new NotFoundException(`Task with given id not found`);
    }
  }

  async updateTaskStatus(id: string, taskStatus: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = taskStatus;
    await this.tasksRepository.save(task);

    return task;
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((x) => x.id === id);

  //   if (!found) {
  //     throw new NotFoundException(`Task with id "${id}" not found`);
  //   }

  //   return found;
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);

  //   return task;
  // }
}
