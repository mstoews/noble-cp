import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FundsModel } from "./Funds.Model";

const selectFundsState = createFeatureSelector<FundsModel>('fnd');

export const selectFunds = createSelector(
    selectFundsState, (state) => {
        return state.funds
    }
);

export const selectFundsDownload = createSelector(
    selectFundsState, (state) => {
        return state.fundsDropDown
    }
);

export const isFundsLoading = createSelector(
    selectFundsState,
    ({ isLoading }) => isLoading
);


