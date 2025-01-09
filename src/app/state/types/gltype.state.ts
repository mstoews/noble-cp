import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { gltypeAPIActions } from './actions/gltype.actions';
import { gltypePageActions } from './actions/gltype.page.actions';
import { IGLType } from 'app/models/types';


export interface State {
  gltype: IGLType[];
  isLoading: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  gltype: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(gltypePageActions.load, (state) => ({ ...state, isLoading: true })),
  on(gltypePageActions.select, (state, { gltype }) => ({
    ...state,
    selectedId: gltype,
  })),
  on(gltypeAPIActions.loadGLTypeSuccess, (state, { gltype }) => ({
    ...state,
    gltype,
    isLoading: false,
  })),
  on(gltypeAPIActions.loadGLTypeFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const gltypeFeature = createFeature({
  name: 'gltypeFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectGltype }) => ({
    selectSelectedGLType: createSelector(
      selectSelectedId,
      selectGltype,
      (selectedId, gltype) => gltype.find((s) => s.gltype === selectedId)
    )
  })
})

