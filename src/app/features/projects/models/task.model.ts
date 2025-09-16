export interface Task {
  task_id: number;
  project_id: number;
  title: string;
  description: string | null;
  deadline: string | null;
  status: 'pending' | 'done';
  link: string | null;
  created_at: string;
}

export interface TaskCreate {
  project_id: number;
  title: string;
  description?: string;
  deadline?: string;
  status?: 'pending' | 'done';
  link?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  deadline?: string;
  status?: 'pending' | 'done';
  link?: string;
}

