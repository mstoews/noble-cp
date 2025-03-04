import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JournalState } from "./Journal.Model";

const getTransactionState = createFeatureSelector<JournalState>('journals');

export const selectTransaction = createSelector(
    getTransactionState, (state) => {
        return state.journals;
    }
);

export const selectJournalId = createSelector( getTransactionState, (state) => {
    return state.activeJournalId;
    }
);

export const cloneJournals = createSelector(
    getTransactionState, (state) => {
        return state.journals;
    }
);

export const selectPanelCode = createSelector(
    getTransactionState,
    ({ journalLedgerPanel }) => journalLedgerPanel
);


export const selectError = createSelector(
    getTransactionState,
    ({ error }) => error
);


export const selectJournalById = (journal_id: number) =>
    createSelector(
        selectTransaction,
        (journals) =>
            journals.find(j => j.journal_id === journal_id)
    );

export const isLoading = createSelector(
    getTransactionState,
        ({ isLoading }) => isLoading
);
