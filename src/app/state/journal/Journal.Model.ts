import { IJournalHeader, IJournalDetailDelete, IJournalDetail, IJournalHeaderUpdate } from "app/models/journals";
import { IPeriodParam } from "app/models/period";


export interface JournalState {
    journals: IJournalHeader[];
    journalDetails: IJournalDetail[];        
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    journal: number | null;
    period: IPeriodParam | null;    
    currentUser: string | null;
    journalLedgerPanel: string | null;
}
