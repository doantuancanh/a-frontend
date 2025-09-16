import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let projectServiceMock: jasmine.SpyObj<ProjectService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    projectServiceMock = jasmine.createSpyObj('ProjectService', ['getProjects', 'deleteProject']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ProjectListComponent,
        NoopAnimationsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    projectServiceMock.getProjects.and.returnValue(of([])); // Default mock
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    const dummyProjects = [
      { project_id: 1, name: 'Project 1', chain: 'Ethereum', source: 'Twitter', status: 'active', created_at: new Date().toISOString(), created_by: 1 }
    ];
    projectServiceMock.getProjects.and.returnValue(of(dummyProjects));

    component.ngOnInit();

    expect(component.projects.length).toBe(1);
    expect(projectServiceMock.getProjects).toHaveBeenCalled();
  });

  it('should open the project dialog when openProjectDialog is called', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of(false) } as any);
    component.openProjectDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should reload projects after the dialog is closed with a result', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of(true) } as any);
    spyOn(component, 'loadProjects');

    component.openProjectDialog();

    expect(component.loadProjects).toHaveBeenCalled();
  });

  it('should open the confirm dialog and delete the project', () => {
    const projectToDelete = { project_id: 1, name: 'Project 1', chain: 'Ethereum', source: 'Twitter', status: 'active', created_at: new Date().toISOString(), created_by: 1 };
    dialogMock.open.and.returnValue({ afterClosed: () => of(true) } as any);
    projectServiceMock.deleteProject.and.returnValue(of(undefined));
    spyOn(component, 'loadProjects');

    component.deleteProject(projectToDelete);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(projectServiceMock.deleteProject).toHaveBeenCalledWith(1);
    expect(component.loadProjects).toHaveBeenCalled();
  });
});
