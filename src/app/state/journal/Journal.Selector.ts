import { createFeatureSelector, createSelector } from "@ngrx/store"; 
import { JournalState } from "./Journal.Model";

const getJournalState = createFeatureSelector<JournalState>('jnl');

export const getJournals = createSelector(
    getJournalState, (state) => {
        return state.journals;
    }
);

export const selectPanelCode = createSelector(
    getJournalState,
    ({ journalLedgerPanel }) => journalLedgerPanel
);

export const selectCurrentUser = createSelector (
    getJournalState,
    ({currentUser}) => currentUser
)

export const selectPeriod = createSelector(
    getJournalState,
    ({ period }) => period
);
  
export const selectError = createSelector(
    getJournalState,
    ({ error }) => error
);

