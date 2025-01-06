import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { priorityAPIActions } from './actions/priority.actions';
import { priorityPageActions } from './actions/priority-page.actions';
import { IPriority } from 'app/models/kanban';

export interface State {
  priority: IPriority[];
  isLoading: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  priority: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(priorityPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(priorityPageActions.select, (state, { priority }) => ({
    ...state,
    selectedId: priority,
  })),
  on(priorityAPIActions.loadPrioritiesSuccess, (state, { priorities }) => ({
    ...state,
    priorities,
    isLoading: false,
  })),
  on(priorityAPIActions.loadPrioritiesFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);
export const priorityFeature = createFeature({
  name: 'priorityFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectPriority }) => ({
    selectSelectedScientist: createSelector(
      selectSelectedId,
      selectPriority,
      (selectedId, priority) => priority.find((s) => s.priority === selectedId)
    )
  })
})
