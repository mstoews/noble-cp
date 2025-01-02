import { createReducer, on } from '@ngrx/store';
import { templateState } from './Funds.State';
import { addFundsSuccess, deleteFundsSuccess, getFundsSuccess, loadFundsFailure, loadFundsSuccess, updateFundsSuccess } from './Funds.Action';

const fundsReducer = createReducer(templateState,
    on(loadFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: action.list,
            error: null,
        }
    }),
    on(loadFundsFailure, (state, action) => {
        return {
            ...state,
            funds: [],
            error: action.error,
        }
    }),
    on(deleteFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: state.funds.filter(x => x.child !== action.id),
            error: null,
        }
    }),
    on(addFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: [...state.funds, action.funds],
            error: null,
        }
    }),
    on(updateFundsSuccess, (state, action) => {
        return {
            ...state,
            funds: state.funds.map(x => x.fund === action.funds.fund ? action.funds : x),
            error: null,
        }
    }),
    on(getFundsSuccess, (state, action) => {
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




