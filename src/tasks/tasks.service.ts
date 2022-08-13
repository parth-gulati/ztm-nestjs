import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((x) => x.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (x) => x.description.includes(search) || x.title.includes(search),
      );
    }

    return tasks;
  }

  deleteTaskById(id: string): Task[] {
    const myArray = this.tasks.filter(function (task) {
      return task.id !== id;
    });

    this.tasks = myArray;

    return myArray;
  }

  updateTaskStatus(id: string, taskStatus: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = taskStatus;
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((x) => x.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
