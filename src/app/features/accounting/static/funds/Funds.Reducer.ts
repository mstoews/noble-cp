import { createReducer, on } from '@ngrx/store';
import { templateState } from './Funds.State';
import { FundsActions} from './Funds.Action';

const fundsReducer = createReducer(templateState,
    on(FundsActions.loadFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: action.funds,
            error: null,
        }
    }),
    on(FundsActions.loadFundsFailure, (state, action) => {
        return {
            ...state,
            funds: [],
            error: action.error,
        }
    }),
    on(FundsActions.deleteFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: state.funds.filter(x => x.child !== action.id),
            error: null,
        }
    }),
    on(FundsActions.addFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: [...state.funds, action.funds],
            error: null,
        }
    }),
    on(FundsActions.updateFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: state.funds.map(x => x.fund === action.funds.fund ? action.funds : x),
            error: null,
        }
    }),
    on(FundsActions.getFundsSuccess, (state, action) => {
        return {
            ...state,
            account: action.funds,
            error: null,
        }
    })
);

export function FundsReducer(state: any, action: any) {
    return fundsReducer(state, action);
}




