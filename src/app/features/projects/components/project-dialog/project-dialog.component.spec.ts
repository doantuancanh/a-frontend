import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProjectDialogComponent } from './project-dialog.component';
import { ProjectService } from '../../services/project.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('ProjectDialogComponent', () => {
  let component: ProjectDialogComponent;
  let fixture: ComponentFixture<ProjectDialogComponent>;
  let projectServiceMock: jasmine.SpyObj<ProjectService>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<ProjectDialogComponent>>;

  const mockProject = {
    project_id: 1, name: 'Test Project', chain: 'Ethereum', source: 'Twitter', status: 'active', created_at: new Date().toISOString(), created_by: 1
  };

  beforeEach(async () => {
    projectServiceMock = jasmine.createSpyObj('ProjectService', ['createProject', 'updateProject']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ProjectDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
      ],
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { project: null } }
      ]
    }).compileComponents();
  });

  function createComponent(data: any) {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('Create Mode', () => {
    beforeEach(() => {
      createComponent({ project: null });
    });

    it('should initialize in create mode', () => {
      expect(component.isEditMode).toBeFalse();
      expect(component.projectForm.value.name).toBe('');
    });

    it('should call createProject on save', () => {
      component.projectForm.setValue({ name: 'New Project', chain: 'BSC', source: '', status: 'active' });
      projectServiceMock.createProject.and.returnValue(of(mockProject));

      component.onSave();

      expect(projectServiceMock.createProject).toHaveBeenCalled();
      expect(dialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      createComponent({ project: mockProject });
    });

    it('should initialize in edit mode with project data', () => {
      expect(component.isEditMode).toBeTrue();
      expect(component.projectForm.value.name).toBe('Test Project');
    });

    it('should call updateProject on save', () => {
      component.projectForm.setValue({ name: 'Updated Project', chain: 'Solana', source: 'Discord', status: 'inactive' });
      projectServiceMock.updateProject.and.returnValue(of(mockProject));

      component.onSave();

      expect(projectServiceMock.updateProject).toHaveBeenCalledWith(mockProject.project_id, component.projectForm.value);
      expect(dialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });

  it('should close the dialog on cancel', () => {
    createComponent({ project: null });
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
