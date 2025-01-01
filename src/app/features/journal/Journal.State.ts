import { JournalState } from './Journal.Model';

export const initialState : JournalState = {
    journals: [],
    journalDetails: [],
    isLoading: false,
    status: 'pending',
    error: null,
    journal: null,
};


