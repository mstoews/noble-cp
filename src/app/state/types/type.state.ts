import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { typeAPIActions } from './actions/type.actions';
import { typePageActions } from './actions/type-page.actions';
import { IType } from 'app/models';

export interface State {
  type: IType[];
  isLoading: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  type: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(typePageActions.load, (state) => ({ ...state, isLoading: true })),
  on(typePageActions.select, (state, { id }) => ({
    ...state,
    selectedId: id })),
  on(typeAPIActions.loadTypeSuccess, (state, { type }) => ({
    ...state,
    transaction_type: type,
    isLoading: false,
  })),
  on(typeAPIActions.loadTypeFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const typeFeature = createFeature({
  name: 'typeFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectType }) => ({
    selectSelectedPeriod: createSelector(
      selectSelectedId,
      selectType,
      (selectedId, type) => type.find((s) => s.transaction_type === selectedId)
    )
  })
})

