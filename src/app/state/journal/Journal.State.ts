import { JournalState } from './Journal.Model';

export const initialState : JournalState = {
    journals: [],
    activeJournalId: null,
    activeJournal: null,
    journalDetails: [],
    accounts: [],
    template: [],
    account_type: [],
    party: [],    
    isLoading: false,
    status: 'pending',
    error: null,
    period: null,
    journalLedgerPanel: null
};


 