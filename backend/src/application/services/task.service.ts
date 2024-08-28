import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/task/create-task.dto';
import { UpdateTaskDto } from '../dto/task/update-task.dto';
import { TaskRepository } from 'src/infrastructure/repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async findAll() {
    return await this.taskRepository.findAllTasks();
  }

  async findOne(id: string) {
    try {
      const task = await this.taskRepository.findTaskById(id);
      if (!task) throw new NotFoundException(`Task with id ${id} not found`);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.update(id, updateTaskDto);
  }

  async remove(id: string) {
    try {
      const task = await this.taskRepository.deleteTask(id);
      if (!task) throw new NotFoundException(`Task with id ${id} not found`);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async asign(idTask: string, idUser: string){
    try {
      const task = await this.taskRepository.asignTo(idTask, idUser);
      if(!task) throw new NotFoundException(`Task with id ${idTask} not found`)
      return task;
    } catch (error) {
      throw error;
    }
  }
}

