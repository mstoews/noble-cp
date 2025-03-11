import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { budgetAPIActions } from './actions/budget.actions';
import { budgetPageActions } from './actions/budget-page.actions';
import { IBudget } from 'app/models';


export interface State {
  budget: IBudget[];
  isLoading: boolean;
  selectedId: number | null;
}

export const initialState: State = {
  budget: [],
  isLoading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,
  on(budgetPageActions.load, (state) => ({ ...state, isLoading: true })),
  on(budgetPageActions.select, (state, { child }) => ({
    ...state,
    selectedId: child,
  })),
  on(budgetAPIActions.loadBudgetSuccess, (state)  => ({
    ...state,
    isLoading: false,
  })),
  on(budgetAPIActions.loadBudgetFailure, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const budgetFeature = createFeature({
  name: 'budgetFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectBudget }) => ({
    selectSelectedPeriod: createSelector(
      selectSelectedId,
      selectBudget,
      (selectedId, budget) => budget.find((s) => s.child === selectedId)
    )
  })
})

