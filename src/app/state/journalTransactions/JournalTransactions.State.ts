import { JournalState } from './JournalTransactions.Model';

export const initialState: JournalState = {
    transactions: [],
    activeJournalId: null,
    activeJournal: null,
    isLoading: false,
    error: null,
    period: null,
    journalLedgerPanel: null
};


