
import { IAccounts } from  'app/models/journals';

export interface AccountModel {
    accounts: IAccounts[];
    isLoading: boolean;
    error: string | null;
}

