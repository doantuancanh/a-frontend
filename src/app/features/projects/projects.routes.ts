import { Routes } from '@angular/router';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/tasks',
    component: TaskListComponent,
    canActivate: [AuthGuard]
  }
];

