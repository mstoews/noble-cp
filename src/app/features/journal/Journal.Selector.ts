import { createFeatureSelector, createSelector } from "@ngrx/store"; 
import { JournalState } from "./Journal.Model";

const getJournalState = createFeatureSelector<JournalState>('journals');

export const getAccounts = createSelector(
    getJournalState, (state) => {
        return state.journals;
    }
);


