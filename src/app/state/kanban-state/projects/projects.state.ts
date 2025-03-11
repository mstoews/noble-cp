import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { projectsAPIActions } from './actions/projects.actions';
import { projectsPageActions } from './actions/projects-page.actions';
import { IProjects } from 'app/models/kanban';

export interface ProjectsState {
  projects: IProjects[];
  isLoading: boolean;
  errorMessage: string;
  selectedId: number | null;  
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  errorMessage: '',  
  selectedId: 0
};

const reducer = createReducer(
  initialState,
  on(projectsPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(projectsPageActions.select, (state, { project_ref }) => ({ ...state, selectedId: project_ref })),
  on(projectsAPIActions.loadProjectsSuccess, (state, { projects }) => ({ ...state,  projects, isLoading: false, })),
  on(projectsAPIActions.loadProjectsFailure, (state) => ({ ...state,  isLoading: false, }))
);

export const projectFeature = createFeature({
  name: 'projectFeature',
  reducer,
  extraSelectors: ({ selectSelectedId , selectProjects }) => ({
    selectSelectedProject: createSelector(
      selectSelectedId,
      selectProjects, 
      (selectedId, project) => project.find((s) => s.project_ref === selectedId))
  })  
})

