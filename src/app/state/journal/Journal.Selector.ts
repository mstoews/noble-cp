import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JournalState } from "./Journal.Model";

const getJournalState = createFeatureSelector<JournalState>('jnl');

export const selectJournals = createSelector(
    getJournalState, (state) => {
        return state.journals;
    }
);

export const selectJournalId = createSelector(getJournalState, (state) => {
    return state.activeJournalId;
}
);

export const cloneJournals = createSelector(
    getJournalState, (state) => {
        return state.journals;
    }
);

export const selectPanelCode = createSelector(
    getJournalState,
    ({ journalLedgerPanel }) => journalLedgerPanel
);


export const selectError = createSelector(
    getJournalState,
    ({ error }) => error
);


export const selectJournalById = (journal_id: number) =>
    createSelector(
        selectJournals,
        (journals) =>
            journals.find(j => j.journal_id === journal_id)
    );

export const isJournalLoading = createSelector(
    getJournalState, (state) => {
        return state.isLoading
    }
);



