import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JournalState } from "./Journal.Model";

const getJournalState = createFeatureSelector<JournalState>('journals');

export const selectJournals = createSelector(
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

