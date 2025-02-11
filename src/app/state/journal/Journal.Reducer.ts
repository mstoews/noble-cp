import { createReducer, on } from '@ngrx/store';
import { initialState } from './Journal.State';

import { JournalActions } from './Journal.Action'; 
         

const journalReducer = createReducer(
    initialState,
    on(JournalActions.loadJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals : action.journals,
            error: null,
        }
    }),

    on(JournalActions.addJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals: [...state.journals, action.journals],
            error: null,
        }
    }),
    
    on(JournalActions.loadJournalHeaderByPeriodSuccess, (state, action) => {
        return {
            ...state,
            journals : action.journals,
            error: null,
        }
    }),

    on(JournalActions.loadJournalDetailSuccess, (state, action) => {
        return {
            ...state,
            journalDetails : action.journalDetails,
            error: null,
        }
    }),
    
    on(JournalActions.loadJournalHeaderFailure, (state, action) => {
        return {
            ...state,
            journals: [],
            error: action.error,
        }
    }
    ),
    on(JournalActions.loadJournalHeaderFailure, (state, action) => {
        return {
            ...state,
            journals: [],
            error: action.error,
        }
    }
    ),
    on(JournalActions.deleteJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals: state.journals.filter(x => x.journal_id !== action.id),
            error: null,
        }
    }),
    on(JournalActions.addJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals: [...state.journals, action.journals],
            error: null,
        }
    }),
    on(JournalActions.updateJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journal_selected: state.journals.map(x => x.journal_id === action.journals.journal_id ? action.journals.journal_id : x),
            error: null,
        }
    }),
    on(JournalActions.getJournalHeaderSuccess, (state, action) => {
         return {
             ...state,
             journal_selected: action.journals,
             error: null,
         }
     })
);

export function JournalReducer(state: any, action: any) {
    return journalReducer(state, action);
}




