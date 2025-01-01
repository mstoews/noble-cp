import { IJournalHeader, IJournalDetailDelete, IJournalDetail, IJournalHeaderUpdate } from "app/models/journals";


export interface JournalState {
    journals: IJournalHeader[];
    journalDetails: IJournalDetail[];        
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    journal: number | null;
}
