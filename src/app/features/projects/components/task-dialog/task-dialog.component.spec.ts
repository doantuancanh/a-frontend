import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TaskDialogComponent } from './task-dialog.component';
import { TaskService } from '../../services/task.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Task } from '../../models/task.model';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<TaskDialogComponent>>;

  const mockTask: Task = {
    task_id: 1, project_id: 1, title: 'Test Task', description: 'Test Description', deadline: new Date().toISOString(), status: 'pending', link: 'http://test.com', created_at: new Date().toISOString()
  };

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['createTask', 'updateTask']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        TaskDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { task: null, projectId: 1 } }
      ]
    }).compileComponents();
  });

  function createComponent(data: any) {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('Create Mode', () => {
    beforeEach(() => {
      createComponent({ task: null, projectId: 1 });
    });

    it('should initialize in create mode', () => {
      expect(component.isEditMode).toBeFalse();
      expect(component.taskForm.value.title).toBe('');
    });

    it('should call createTask on save', () => {
      component.taskForm.setValue({ title: 'New Task', description: '', deadline: null, status: 'pending', link: '' });
      taskServiceMock.createTask.and.returnValue(of(mockTask));

      component.onSave();

      expect(taskServiceMock.createTask).toHaveBeenCalled();
      expect(dialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      createComponent({ task: mockTask, projectId: 1 });
    });

    it('should initialize in edit mode with task data', () => {
      expect(component.isEditMode).toBeTrue();
      expect(component.taskForm.value.title).toBe('Test Task');
    });

    it('should call updateTask on save', () => {
      component.taskForm.setValue({ title: 'Updated Task', description: '', deadline: null, status: 'done', link: '' });
      taskServiceMock.updateTask.and.returnValue(of(mockTask));

      component.onSave();

      expect(taskServiceMock.updateTask).toHaveBeenCalledWith(mockTask.task_id, jasmine.any(Object));
      expect(dialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });

  it('should close the dialog on cancel', () => {
    createComponent({ task: null, projectId: 1 });
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
