import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../../environments/environment';
import { Task, TaskCreate, TaskUpdate } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve tasks for a project via GET', () => {
    const dummyTasks: Task[] = [
      { task_id: 1, project_id: 1, title: 'Task 1', description: null, deadline: null, status: 'pending', link: null, created_at: new Date().toISOString() },
      { task_id: 2, project_id: 1, title: 'Task 2', description: null, deadline: null, status: 'done', link: null, created_at: new Date().toISOString() }
    ];

    service.getTasksForProject(1).subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(`${apiUrl}/projects/1/tasks/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should create a task via POST', () => {
    const newTask: TaskCreate = { project_id: 1, title: 'New Task' };
    const createdTask: Task = { task_id: 3, ...newTask, description: null, deadline: null, status: 'pending', link: null, created_at: new Date().toISOString() };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(`${apiUrl}/projects/1/tasks/`);
    expect(req.request.method).toBe('POST');
    req.flush(createdTask);
  });

  it('should update a task via PUT', () => {
    const updatedTaskData: TaskUpdate = { title: 'Updated Task' };
    const updatedTask: Task = { task_id: 1, project_id: 1, title: 'Updated Task', description: null, deadline: null, status: 'pending', link: null, created_at: new Date().toISOString() };

    service.updateTask(1, updatedTaskData).subscribe(task => {
      expect(task.title).toBe('Updated Task');
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});

