import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/domain/entities/task.entity';
import { ITaskRepository } from 'src/domain/interface/task.repository.interface';
import { Repository } from 'typeorm';

export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(task: Partial<Task>): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    return await this.taskRepository.save(newTask);
  }

  async findAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findTaskById(id: string): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async updateTask(id: string, updateData : Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, updateData);
    return await this.findTaskById(id);
  }

  async deleteTask(id: string): Promise<Task> {
    try {
      const findedTask = await this.findTaskById(id);
      if (!findedTask)
        throw new NotFoundException(`Project with ${id} not found`);
      await this.taskRepository.delete(id);
      return findedTask;
    } catch (error) {
      throw error;
    }
  }
}
