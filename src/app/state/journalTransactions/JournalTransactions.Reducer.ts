import { createReducer, on } from '@ngrx/store';
import { initialState } from './JournalTransactions.State';

import { JournalActions } from './JournalTransactions.Action';


const journalTransactionReducer = createReducer(
    initialState,
    on(JournalActions.loadJournalSuccess, (state, action) => {
        return {
            ...state,
            transactions: action.transactions,
            error: null,
        }
    }),

    on(JournalActions.addJournalSuccess, (state, action) => {
        return {
            ...state,
            transactions: [...state.transactions, action.transactions],
            error: null,
        }
    }),

    on(JournalActions.loadJournalByPeriodSuccess, (state, action) => {
        return {
            ...state,
            transactions: action.transactions,
            error: null,
        }
    }),


    on(JournalActions.loadJournalFailure, (state, action) => {
        return {
            ...state,
            transactions: [],
            error: action.error,
        }
    }
    ),

    on(JournalActions.deleteJournalSuccess, (state, action) => {
        return {
            ...state,
            transactions: state.transactions.filter(x => x.journal_id !== action.id),
            error: null,
        }
    }),

    // on(JournalActions.updateJournalSuccess, (state, action) => {
    //     return {
    //         ...state,
    //         // transactions: [...state.transactions, action.transactions],
    //         transactions: state.transactions.map(x => x.journal_id === action.transactions.journal_id ? action.transactions.journal_id : x),
    //         error: null,
    //     }
    // }),

    on(JournalActions.addJournalSuccess, (state, action) => {
        return {
            ...state,
            transactions: [...state.transactions, action.transactions],
            error: null,
        }
    }),
    
    on(JournalActions.getJournalSuccess, (state, action) => {
        return {
            ...state,
            activeJournal: action.transactions,
            error: null,
        }
    })
);

export function JournalTransactionReducer(state: any, action: any) {
    return journalTransactionReducer(state, action);
}




