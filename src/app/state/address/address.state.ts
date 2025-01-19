import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { addressAPIActions } from './actions/address.actions';
import { addressPageActions } from './actions/address-page.actions';
import { Iaddresss } from 'app/models';

export interface State {
  addresss: Iaddresss[];
  isLoading: boolean;
  selectedId: number | null;
}

export const initialState: State = {
  addresss: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(addressPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(addressAPIActions.loadAddresssSuccess, (state, { addresss }) => ({ ...state, addresss, isLoading: false, })),
  on(addressAPIActions.loadAddresssFailure, (state) => ({ ...state, isLoading: false, })),

  on(addressPageActions.select, (state, { address }) => ({ ...state, selectedId: address })),
  on(addressPageActions.deleteaddress, (state) => ({ ...state, isLoading: true })),
  on(addressPageActions.addaddress, (state) => ({ ...state, isLoading: true })),
  on(addressPageActions.updateaddress, (state) => ({ ...state, isLoading: true })),


  on(addressAPIActions.addressUpdatedFail, (state) => ({ ...state, isLoading: false, })),
  on(addressAPIActions.addressAddedSuccess, (state, { address }) => ({ ...state, addresss: [...state.addresss, address], isLoading: false, })),
  on(addressAPIActions.addressAddedFail, (state) => ({ ...state, isLoading: false, })),
  on(addressAPIActions.addressDeletedFail, (state) => ({ ...state, isLoading: false, })),
  on(addressAPIActions.addressUpdatedSuccess, (state) => ({ ...state, isLoading: false, }))

);

export const addresssFeature = createFeature({
  name: 'addresssFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectaddresss }) => ({
    selectSelectedaddress: createSelector(
      selectSelectedId,
      selectaddresss,
      (selectedId, address) => address.find((s) => s.address === selectedId)
    )
  })
})

