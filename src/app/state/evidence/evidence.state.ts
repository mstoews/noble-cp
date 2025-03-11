import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { artifactsAPIActions } from './actions/evidence.actions';
import { artifactsPageActions } from './actions/evidence-page.actions';
import { IArtifacts } from 'app/models/journals';


export interface State {
  artifacts: IArtifacts[];
  isLoading: boolean;
  selectedId: number | null;
}

export const initialState: State = {
  artifacts: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(artifactsPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(artifactsPageActions.select, (state, { journal_id }) => ({
    ...state,
    selectedId: journal_id
  })),
  on(artifactsAPIActions.loadArtifactsSuccess, (state, { artifacts }) => ({
    ...state,
    artifacts,
    isLoading: false,
  })),
  on(artifactsAPIActions.loadArtifactsFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const artifactFeature = createFeature({
  name: 'artifactFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectArtifacts }) => ({
    selectSelectedPeriod: createSelector(
      selectSelectedId,
      selectArtifacts,
      (selectedId, artifact) => artifact.find((s) => s.journal_id  === selectedId)
    )
  })
})

