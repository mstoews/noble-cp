import { createReducer, on } from '@ngrx/store';
import { initialState } from './Journal.State';

import { JournalActions } from './Journal.Action'; 
         

const journalTransactionReducer = createReducer(
    initialState,
    on(JournalActions.loadJournalSuccess, (state, action) => {
        return {
            ...state,
            journals : action.journals,
            error: null,
        }
    }),

    on(JournalActions.addJournalSuccess, (state, action) => {
        return {
            ...state,
            journals: [...state.journals, action.journals],
            error: null,
        }
    }),
    
    on(JournalActions.loadJournalByPeriodSuccess, (state, action) => {
        return {
            ...state,
            journals : action.journals,
            error: null,
        }
    }),

    
    on(JournalActions.loadJournalFailure, (state, action) => {
        return {
            ...state,
            journals: [],
            error: action.error,
        }
    }
    ),
    
    on(JournalActions.deleteJournalSuccess, (state, action) => {
        return {
            ...state,
            journals: state.journals.filter(x => x.journal_id !== action.id),
            error: null,
        }
    }),
    on(JournalActions.addJournalSuccess, (state, action) => {
        return {
            ...state,
            journals: [...state.journals, action.journals],
            error: null,
        }
    }),
    on(JournalActions.updateJournalSuccess, (state, action) => {
        return {
            ...state,
            journal_selected: state.journals.map(x => x.journal_id === action.journals.journal_id ? action.journals.journal_id : x),
            error: null,
        }
    }),
    on(JournalActions.getJournalSuccess, (state, action) => {
         return {
             ...state,
             journal_selected: action.journals,
             error: null,
         }
     })
);

export function JournalTransactionReducer(state: any, action: any) {
    return journalTransactionReducer(state, action);
}




