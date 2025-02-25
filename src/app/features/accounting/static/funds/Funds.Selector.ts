import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FundsModel } from "./Funds.Model";

const selectFundsState = createFeatureSelector<FundsModel>('fnd');

export const selectFunds = createSelector(
    selectFundsState, (state) => {
        return state.funds
    }
);


