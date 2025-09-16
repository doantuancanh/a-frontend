import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { Task, TaskCreate, TaskUpdate } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);

  taskForm: FormGroup;
  isEditMode = false;
  projectId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { task: Task, projectId: number }) {
    this.isEditMode = !!this.data.task;
    this.projectId = this.data.projectId;

    this.taskForm = this.fb.group({
      title: [this.data.task?.title || '', Validators.required],
      description: [this.data.task?.description || ''],
      deadline: [this.data.task?.deadline ? new Date(this.data.task.deadline) : null],
      status: [this.data.task?.status || 'pending', Validators.required],
      link: [this.data.task?.link || '']
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const deadline = formValue.deadline ? new Date(formValue.deadline).toISOString() : undefined;

      if (this.isEditMode) {
        const updatedTask: TaskUpdate = { ...formValue, deadline };
        this.taskService.updateTask(this.data.task.task_id, updatedTask)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        const newTask: TaskCreate = { ...formValue, deadline, project_id: this.projectId };
        this.taskService.createTask(newTask)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
