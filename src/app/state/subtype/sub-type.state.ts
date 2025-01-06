import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { subtypeAPIActions } from './actions/sub-type.actions';
import { subtypePageActions } from './actions/sub-type.page.actions';
import { ISubType } from 'app/models/subtypes';


export interface State {
  subtype: ISubType[];
  isLoading: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  subtype: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(subtypePageActions.load, (state) => ({ ...state, isLoading: true })),
  on(subtypePageActions.select, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(subtypeAPIActions.loadSubTypeSuccess , (state, { subtype }) => ({
    ...state,
    subtype,
    isLoading: false,
  })),
  on(subtypeAPIActions.loadSubTypeFailure , (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const subtypeFeature = createFeature({
  name: 'subtypeFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectSubtype }) => ({
    selectSelectedSubtype: createSelector(
      selectSelectedId,
      selectSubtype,
      (selectedId, subtype) => subtype.find((s) => s.id === selectedId)
    )
  })
})

