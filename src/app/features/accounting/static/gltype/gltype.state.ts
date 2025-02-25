import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { glTypeAPIActions } from './gltype.actions';
import { glTypePageActions } from './gltype.page.actions';
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
  on(glTypePageActions.load, (state) => ({ ...state, isLoading: true })),
  on(glTypePageActions.select, (state, { gltype }) => ({
    ...state,
    selectedId: gltype,
  })),
  on(glTypePageActions.update, (state) => ({ ...state, isLoading: true })),
  on(glTypeAPIActions.loadGLTypeSuccess, (state, { gltype }) => ({
    ...state,
    gltype,
    isLoading: false,
  })),
  on(glTypeAPIActions.loadGLTypeFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(glTypeAPIActions.gLTypeUpdatedFail, (state)  => ({ ...state, isLoading: false,  })),
  on(glTypeAPIActions.gLTypeUpdatedSuccess, (state, action) =>   ({ ...state,  party: state.gltype.map(x => x.gltype === action.gltype.gltype ? action.gltype : x),              isLoading: false, }))
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

