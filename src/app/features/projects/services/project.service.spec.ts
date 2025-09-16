import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { environment } from '../../../../environments/environment';
import { Project, ProjectCreate, ProjectUpdate } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/projects`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve projects from the API via GET', () => {
    const dummyProjects: Project[] = [
      { project_id: 1, name: 'Project 1', chain: 'Ethereum', source: 'Twitter', status: 'active', created_at: new Date().toISOString(), created_by: 1 },
      { project_id: 2, name: 'Project 2', chain: 'Solana', source: 'Discord', status: 'inactive', created_at: new Date().toISOString(), created_by: 1 }
    ];

    service.getProjects().subscribe(projects => {
      expect(projects.length).toBe(2);
      expect(projects).toEqual(dummyProjects);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProjects);
  });

  it('should create a project via POST', () => {
    const newProject: ProjectCreate = { name: 'New Project', chain: 'BSC', created_by: 1 };
    const createdProject: Project = { project_id: 3, ...newProject, source: '', status: 'active', created_at: new Date().toISOString() };

    service.createProject(newProject).subscribe(project => {
      expect(project).toEqual(createdProject);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(createdProject);
  });

  it('should update a project via PUT', () => {
    const updatedProjectData: ProjectUpdate = { name: 'Updated Project' };
    const updatedProject: Project = { project_id: 1, name: 'Updated Project', chain: 'Ethereum', source: 'Twitter', status: 'active', created_at: new Date().toISOString(), created_by: 1 };

    service.updateProject(1, updatedProjectData).subscribe(project => {
      expect(project.name).toBe('Updated Project');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProject);
  });

  it('should delete a project via DELETE', () => {
    service.deleteProject(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});

