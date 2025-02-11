import { IAccounts } from "app/models";
import { IJournalHeader, IJournalDetail, IJournalTemplate,} from "app/models/journals";
import { IParty } from "app/models/party";
import { IPeriodParam } from "app/models/period";
import { IType } from "app/models/types";

export interface JournalState {
    journals: IJournalHeader[] | null;
    activeJournalId: number | null;
    activeJournal: IJournalHeader | null;
    journalDetails: IJournalDetail[] | null;        
    template: IJournalTemplate[] | null;
    accounts: IAccounts[] | null
    account_type: IType[] | null;
    party: IParty[] | null;    
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    period: IPeriodParam | null;    
    journalLedgerPanel: string | null;
}
