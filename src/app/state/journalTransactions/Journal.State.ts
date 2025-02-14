import { JournalState } from './Journal.Model';

export const initialState : JournalState = {
    journals: [],
    activeJournalId: null,
    activeJournal: null,
    isLoading: false,
    error: null,
    period: null,
    journalLedgerPanel: null
};


 