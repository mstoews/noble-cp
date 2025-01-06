import { IFunds } from  'app/models';

export interface FundsModel {
    funds: IFunds[];
    isLoading: boolean;
    error: string | null;
}

