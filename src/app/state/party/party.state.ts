import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { partyAPIActions } from './actions/party.actions';
import { partyPageActions } from './actions/party-page.actions';
import { IParty } from 'app/models/party';

export interface State {
  party: IParty[];
  isLoading: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  party: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(partyPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(partyPageActions.select, (state, { party_id }) => ({ ...state, selectedId: party_id,})),
  on(partyAPIActions.loadPartySuccess, (state, { party }) => ({ ...state, party, isLoading: false,  })),
  on(partyAPIActions.loadPartyFailure, (state) => ({ ...state, isLoading: false, }))
);

export const partyFeature = createFeature({
  name: 'partyFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectParty }) => ({
    selectSelectedParty: createSelector(
      selectSelectedId,
      selectParty,
      (selectedId, party) => party.find((s) => s.party_id === selectedId)
    )
  })
})

