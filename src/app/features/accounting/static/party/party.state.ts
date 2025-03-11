import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { partyAPIActions } from './party.actions';
import { partyPageActions } from './party-page.actions';
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
  on(partyPageActions.select, (state, { party_id}) => ({ ...state, selectedId: party_id })),
  on(partyPageActions.deleteParty, (state) => ({ ...state, isLoading: true })),
  on(partyPageActions.addParty, (state) => ({ ...state, isLoading: true })),
  on(partyPageActions.updateParty, (state) => ({ ...state, isLoading: true })),
  
  on(partyAPIActions.loadPartySuccess, (state, { party }) => ({  ...state,  party,    isLoading: false,})),
  on(partyAPIActions.loadPartyFailure, (state) => ({ ...state, isLoading: false,  })),
  
  on(partyAPIActions.partyAddedSuccess, (state, { party }) => ({ ...state, party: [...state.party, party], isLoading: false, })),
  on(partyAPIActions.partyAddedFail, (state) => ({...state, isLoading: false,  })),  
  on(partyAPIActions.partyDeletedSuccess, (state, { id }) => ({ ...state, party: state.party.filter((s) => s.party_id !== id), isLoading: false,  })),
  on(partyAPIActions.partyDeletedFail, (state) => ({...state, isLoading: false,  })),    
  
  // updated Party
  on(partyAPIActions.partyUpdatedFail , (state)  =>   ({ ...state, isLoading: false,  })),
  on(partyAPIActions.partyUpdatedSuccess, (state, action) => ({ ...state,  party: state.party.map(x => x.party_id === action.party.party_id ? action.party : x), isLoading: false, }))
 );

export const partyFeature = createFeature({
  name: 'partyFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectParty }) => ({
    selectSelectedParty: createSelector(
      selectSelectedId,
      selectParty, 
      (selectedId, party) => party.find((s) => s.party_id === selectedId))
  })
})

