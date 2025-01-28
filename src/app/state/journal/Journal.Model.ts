import { IAccounts } from "app/models";
import { IJournalHeader, IJournalDetail, IJournalTemplate,} from "app/models/journals";
import { IParty } from "app/models/party";
import { IPeriodParam } from "app/models/period";
import { IType } from "app/models/types";

export interface JournalState {
    journals: IJournalHeader[];
    journalDetails: IJournalDetail[];        
    template: IJournalTemplate[];
    accounts: IAccounts[];
    account_type: IType[];
    party: IParty[];    
    isLoading: boolean;
    status: 'pending' | 'success' | 'loading' | 'error';
    error: string | null;
    journal: number | null;
    period: IPeriodParam | null;    
    journalLedgerPanel: string | null;
}
