import { IFunds } from  'app/models';

export interface FundsModel {
    funds: IFunds[];
    activeFundId: number | null;
    selectedFund: IFunds | null;
    isLoading: boolean;
    error: string | null;
}

