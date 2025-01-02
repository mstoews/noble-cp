import { createFeatureSelector, createSelector } from "@ngrx/store"; 
import { JournalState } from "./Journal.Model";

const getJournalState = createFeatureSelector<JournalState>('jnl');

export const getJournals = createSelector(
    getJournalState, (state) => {
        return state.journals;
    }
);



