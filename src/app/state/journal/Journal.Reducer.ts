import { createReducer, on } from '@ngrx/store';
import { initialState } from './Journal.State';

import { 
        addJournalHeaderSuccess, 
        deleteJournalHeaderSuccess, 
        getJournalHeaderSuccess,
        loadJournalHeaderFailure,
        updateJournalHeaderSuccess,
        loadJournalHeaderSuccess,          
        loadJournalDetailSuccess,
        loadJournalDetailFailure,
        deleteJournalDetailSuccess,
        addJournalDetailSuccess,
        updateJournalDetailSuccess,
        getJournalDetailSuccess,
        loadJournalDetail,
        loadJournalHeaderByPeriodSuccess,
        } from './Journal.Action'; 
         

const journalReducer = createReducer(
    initialState,
    on(loadJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals : action.journals,
            error: null,
        }
    }),
    
    on(loadJournalHeaderByPeriodSuccess, (state, action) => {
        return {
            ...state,
            journals : action.journals,
            error: null,
        }
    }),

    on(loadJournalDetailSuccess, (state, action) => {
        return {
            ...state,
            journalDetails : action.journalDetails,
            error: null,
        }
    }),
    
    on(loadJournalHeaderFailure, (state, action) => {
        return {
            ...state,
            journals: [],
            error: action.error,
        }
    }
    ),
    on(loadJournalHeaderFailure, (state, action) => {
        return {
            ...state,
            journals: [],
            error: action.error,
        }
    }
    ),
    on(deleteJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals: state.journals.filter(x => x.journal_id !== action.id),
            error: null,
        }
    }),
    on(addJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journals: [...state.journals, action.journals],
            error: null,
        }
    }),
    on(updateJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journal_selected: state.journals.map(x => x.journal_id === action.journals.journal_id ? action.journals.journal_id : x),
            error: null,
        }
    }),
    on(getJournalHeaderSuccess, (state, action) => {
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




