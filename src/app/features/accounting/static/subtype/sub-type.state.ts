import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { subTypeAPIActions } from './sub-type.actions';
import { subTypePageActions } from './sub-type-page.actions';
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
  on(subTypePageActions.load, (state) => ({ ...state, isLoading: true })),
  on(subTypePageActions.select, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(subTypeAPIActions.subTypeLoadSuccess, (state, { subtype }) => ({
    ...state,
    subtype,
    isLoading: false,
  })),
  on(subTypeAPIActions.subTypeLoadFailure, (state) => ({
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

