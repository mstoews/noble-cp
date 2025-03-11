import { IJournalTransactions, IJournalHeader } from "app/models/journals";
import { IPeriodParam } from "app/models/period";

export interface JournalState {
    transactions: IJournalTransactions[] | null;
    activeJournalId: number | null;
    activeJournal: IJournalTransactions | null;
    isLoading: boolean;
    error: string | null;
    period: IPeriodParam | null;
    journalLedgerPanel: string | null;
}
    