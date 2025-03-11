import { IJournalHeader, IJournalDetail } from "app/models/journals";
import { IPeriodParam } from "app/models/period";

export interface JournalState {
    journals: IJournalHeader[] | null;
    activeJournalId: number | null;
    activeJournal: IJournalHeader | null;
    journalDetails: IJournalDetail[] | null;
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    period: IPeriodParam | null;    
    journalLedgerPanel: string | null;
}
