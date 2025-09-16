export interface Project {
  project_id: number;
  name: string;
  chain: string;
  source: string;
  status: 'active' | 'inactive';
  created_at: string;
  created_by: number;
}

export interface ProjectCreate {
  name: string;
  chain?: string;
  source?: string;
  status?: 'active' | 'inactive';
  created_by: number;
}

export interface ProjectUpdate {
  name?: string;
  chain?: string;
  source?: string;
  status?: 'active' | 'inactive';
}

