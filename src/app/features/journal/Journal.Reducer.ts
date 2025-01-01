import { createReducer, on } from '@ngrx/store';

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
          } from './Journal.Action'; 
         
import { initialState } from './Journal.State';

const journalReducer = createReducer(
    initialState,
    on(loadJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journal_header : action.journal_headers,
            error: null,
        }
    }),

    on(getJournalDetailSuccess, (state, action) => {
        return {
            ...state,
            journal_details : action.journal_details,
            error: null,
        }
    }),

    on(loadJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journal_details : action.journal_headers,
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
            journals: [...state.journals, action.journal_header],
            error: null,
        }
    }),
    on(updateJournalHeaderSuccess, (state, action) => {
        return {
            ...state,
            journal_selected: state.journals.map(x => x.journal_id === action.journal_header.journal_id ? action.journal_header.journal_id : x),
            error: null,
        }
    }),
    on(getJournalHeaderSuccess, (state, action) => {
         return {
             ...state,
             journal_selected: action.journal_header,
             error: null,
         }
     })
);

export function JournalReducer(state: any, action: any) {
    return journalReducer(state, action);
}




