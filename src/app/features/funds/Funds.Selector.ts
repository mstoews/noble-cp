import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FundsModel } from "./Funds.Model";

const getFundsState = createFeatureSelector<FundsModel>('fnd');

export const getFunds = createSelector(
    getFundsState, (state) => {
        return state.list
    }
);


