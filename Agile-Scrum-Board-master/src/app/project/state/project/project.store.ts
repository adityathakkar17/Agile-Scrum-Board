import { JProject } from '@trungk18/interface/project';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { JUser } from '@trungk18/interface/user';

export type ProjectState = JProject;

function createInitialState(): ProjectState {
  return {
    issues: [],
    users:[]
  } as ProjectState;
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'project'
})
export class ProjectStore extends Store<ProjectState> {
  constructor() {
    projectservice: ProjectService;
    super(createInitialState());
  }
}
