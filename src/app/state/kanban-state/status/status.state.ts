import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { teamAPIActions } from './actions/status.actions';
import { teamPageActions } from './actions/status-page.actions';
import { ITeam } from 'app/models/team';

export interface State {
  team: ITeam[];
  isLoading: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  team: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(teamPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(teamPageActions.select, (state, { uid }) => ({
    ...state,
    selectedId: uid,
  })),
  on(teamAPIActions.loadTeamSuccess, (state, { team }) => ({
    ...state,
    team,
    isLoading: false,
  })),
  on(teamAPIActions.loadTeamFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const teamFeature = createFeature({
  name: 'teamFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectTeam }) => ({
    selectSelectedPeriod: createSelector(
      selectSelectedId,
      selectTeam,
      (selectedId, team) => team.find((s) => s.uid === selectedId)
    )
  })
})

