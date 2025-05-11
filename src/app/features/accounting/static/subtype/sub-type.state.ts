import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { subTypeAPIActions } from './sub-type.actions';
import { subTypePageActions } from './sub-type-page.actions';
import { ISubType, ISubtypeDropDown } from 'app/models/subtypes';


export interface State {
  subtypeDropdown: ISubtypeDropDown[];
  subtype: ISubType[];
  isLoading: boolean;
  isLoaded: boolean;
  selectedId: string | null;
}

export const initialState: State = {
  subtypeDropdown: [],
  subtype: [],
  isLoading: false,
  isLoaded: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,

  // subtype load state

  on(subTypePageActions.load, (state) => ({ ...state, isLoading: true })),
  on(subTypePageActions.select, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),

  on(subTypeAPIActions.subTypeLoadSuccess, (state, { subtype }) => ({
    ...state,
    subtype,
    isLoading: false,
    isLoaded: true,
  })),

  on(subTypeAPIActions.subTypeLoadFailure, (state) => ({
    ...state,
    isLoading: false,
  })),


  // dropdown load state

  on(subTypePageActions.loadDropdown, (state) => ({ ...state, isLoading: true })),
  on(subTypeAPIActions.subTypeDropdownSuccess, (state, { subtype }) => ({
    ...state,
    subtypeDropdown: subtype,
    isLoading: false,
    isLoaded: true,
  }) ),

  on(subTypeAPIActions.subTypeDropdownFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
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

