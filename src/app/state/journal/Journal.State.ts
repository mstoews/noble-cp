import { JournalState } from './Journal.Model';

export const initialState : JournalState = {
    journals: [],
    journalDetails: [],
    accounts: [],
    template: [],
    account_type: [],
    party: [],    
    isLoading: false,
    status: 'pending',
    error: null,
    journal: null,
    period: null,
    journalLedgerPanel: null
};


 