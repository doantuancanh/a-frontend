import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasksForProject', 'deleteTask']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1',
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        NoopAnimationsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskServiceMock.getTasksForProject.and.returnValue(of([])); // Default mock
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    const dummyTasks: Task[] = [
      { task_id: 1, project_id: 1, title: 'Task 1', description: null, deadline: null, status: 'pending', link: null, created_at: new Date().toISOString() }
    ];
    taskServiceMock.getTasksForProject.and.returnValue(of(dummyTasks));

    component.ngOnInit();

    expect(component.tasks.length).toBe(1);
    expect(taskServiceMock.getTasksForProject).toHaveBeenCalledWith(1);
  });

  it('should open the task dialog when openTaskDialog is called', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of(false) } as any);
    component.openTaskDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should reload tasks after the dialog is closed with a result', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of(true) } as any);
    spyOn(component, 'loadTasks');

    component.openTaskDialog();

    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should open the confirm dialog and delete the task', () => {
    const taskToDelete: Task = { task_id: 1, project_id: 1, title: 'Task 1', description: null, deadline: null, status: 'pending', link: null, created_at: new Date().toISOString() };
    dialogMock.open.and.returnValue({ afterClosed: () => of(true) } as any);
    taskServiceMock.deleteTask.and.returnValue(of(undefined));
    spyOn(component, 'loadTasks');

    component.deleteTask(taskToDelete);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(1);
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should navigate back to projects page', () => {
    component.goBackToProjects();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/projects']);
  });
});
