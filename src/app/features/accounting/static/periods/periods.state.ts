import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { periodsAPIActions } from './actions/periods.actions';
import { periodsPageActions } from './actions/periods-page.actions';
import { IPeriod } from 'app/models/period';

export interface State {
  periods: IPeriod[];
  isLoading: boolean;
  selectedId: number | null;
}

export const initialState: State = {
  periods: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(periodsPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(periodsPageActions.select, (state, { period }) => ({ ...state, selectedId: period })),
  on(periodsPageActions.deletePeriod, (state) => ({ ...state, isLoading: true })),
  on(periodsPageActions.addPeriod, (state) => ({ ...state, isLoading: true })),
  on(periodsPageActions.updatePeriod, (state) => ({ ...state, isLoading: true })),
  on(periodsAPIActions.loadPeriodsSuccess, (state, { periods }) => ({  ...state,  periods,    isLoading: false,  })),
  on(periodsAPIActions.loadPeriodsFailure, (state) => ({    ...state,    isLoading: false,  })),
  on(periodsAPIActions.periodUpdatedFail , (state)  => ({    ...state,    isLoading: false,  })),
  on(periodsAPIActions.periodAddedSuccess, (state, { period }) => ({      ...state,    periods: [...state.periods, period],    isLoading: false,  })),
  on(periodsAPIActions.periodAddedFail, (state) => ({    ...state,    isLoading: false,  })),  
  on(periodsAPIActions.periodDeletedSuccess, (state, { id }) => ({    ...state,    periods: state.periods.filter((s) => s.id !== id),    isLoading: false,  })),
  on(periodsAPIActions.periodDeletedFail, (state) => ({    ...state,    isLoading: false,  })),  
  on(periodsAPIActions.periodUpdatedSuccess, (state) => ({    ...state,    isLoading: false,  }))
  
);

export const periodsFeature = createFeature({
  name: 'periodsFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectPeriods }) => ({
    selectSelectedPeriod: createSelector(
      selectSelectedId,
      selectPeriods,
      (selectedId, period) => period.find((s) => s.period === selectedId)
    )
  })
})

