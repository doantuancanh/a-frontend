import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { Project, ProjectCreate, ProjectUpdate } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>);

  projectForm: FormGroup;
  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project: Project }) {
    this.isEditMode = !!this.data.project;
    this.projectForm = this.fb.group({
      name: [this.data.project?.name || '', Validators.required],
      chain: [this.data.project?.chain || ''],
      source: [this.data.project?.source || ''],
      status: [this.data.project?.status || 'active', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      if (this.isEditMode) {
        const updatedProject: ProjectUpdate = { ...formValue };
        this.projectService.updateProject(this.data.project.project_id, updatedProject)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        // This is a simplified version. In a real app, you'd get the current user's ID.
        const newProject: ProjectCreate = { ...formValue, created_by: 1 };
        this.projectService.createProject(newProject)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
