import { createAction, props } from "@ngrx/store";
import { IJournalTransactions } from "app/models/journals";
import { IPeriodParam } from "app/models/period";

// Load Static Data Actions

export const LOAD_JOURNAL = '[JRN] getall';
export const LOAD_JOURNAL_SUCCESS = '[JRN] getall success';
export const LOAD_JOURNAL_FAILURE = '[JRN] getall failure';

export const LOAD_JOURNAL_BY_PERIOD = '[JRN] getJournalByPeriod';
export const LOAD_JOURNAL_BY_PERIOD_SUCCESS = '[JRN] getJournalByPeriod success';
export const LOAD_JOURNAL_BY_PERIOD_FAILURE = '[JRN] getJournalByPeriod failure';


export const DELETE_JOURNAL = '[JRN] delete'
export const DELETE_JOURNAL_SUCCESS = '[JRN] delete success'

export const ADD_JOURNAL = '[JRN] add'
export const ADD_JOURNAL_SUCCESS = '[JRN] add success'

export const UPDATE_JOURNAL = '[JRN] update'
export const UPDATE_JOURNAL_SUCCESS = '[JRN] update success'

export const CLONE_JOURNAL = '[JRN_CLONE] clone'
export const CLONE_JOURNAL_SUCCESS = '[JRN_CLONE] clone success'
export const CLONE_JOURNAL_FAILURE = '[JRN_CLONE] clone failure'

export const GET_JOURNAL = '[JRN] get jrn'
export const GET_JOURNAL_SUCCESS = '[JRN] get journal success'
export const GET_JOURNAL_FAILURE = '[JRN] get journal failure'
export const GET_JOURNAL_ACTIVE_JOURNAL = '[JRN] get active journal'

export const getActiveJournal = createAction(GET_JOURNAL_ACTIVE_JOURNAL, props<{ activeJournalId: number }>());

export const loadJournal = createAction(LOAD_JOURNAL, props<{ period: IPeriodParam }>());

export const loadJournalSuccess = createAction(LOAD_JOURNAL_SUCCESS, props<{ journals: IJournalTransactions[] }>());
export const loadJournalFailure = createAction(LOAD_JOURNAL_FAILURE, props<{ error: string }>());

export const cloneJournal = createAction(CLONE_JOURNAL, props<{ journal_id: number }>());
export const cloneJournalSuccess = createAction(GET_JOURNAL_SUCCESS, props<{ journals: IJournalTransactions }>());
export const cloneJournalFailure = createAction(GET_JOURNAL_FAILURE, props<{ error: string }>());


export const loadJournalByPeriod = createAction(LOAD_JOURNAL_BY_PERIOD, props<{ period: IPeriodParam }>());
export const loadJournalByPeriodSuccess = createAction(LOAD_JOURNAL_SUCCESS, props<{ journals: IJournalTransactions[] }>());
export const loadJournalByPeriodFailure = createAction(LOAD_JOURNAL_FAILURE, props<{ error: string }>());

export const deleteJournal = createAction(DELETE_JOURNAL, props<{ id: number }>());
export const deleteJournalSuccess = createAction(DELETE_JOURNAL_SUCCESS, props<{ id: number }>());

export const addJournal = createAction(ADD_JOURNAL, props<{ journals: IJournalTransactions }>());
export const addJournalSuccess = createAction(ADD_JOURNAL_SUCCESS, props<{ journals: IJournalTransactions }>());

export const updateJournal = createAction(UPDATE_JOURNAL, props<{ journals: IJournalTransactions }>());
export const updateJournalSuccess = createAction(UPDATE_JOURNAL_SUCCESS, props<{ journals: IJournalTransactions }>());

export const getJournal = createAction(GET_JOURNAL, props<{ journal_id: number }>());
export const getJournalSuccess = createAction(GET_JOURNAL_SUCCESS, props<{ journals: IJournalTransactions }>());
export const getJournalFailure = createAction(GET_JOURNAL_FAILURE, props<{ error: string }>());


// Journal Details Actions

export const emptyAction = createAction('Empty Action');

export const JournalActions = {
    loadJournal,
    loadJournalByPeriod,
    loadJournalSuccess,
    loadJournalFailure,
    deleteJournal,
    deleteJournalSuccess,
    addJournal,
    addJournalSuccess,
    updateJournal,
    updateJournalSuccess,
    getJournal,
    getJournalSuccess,
    getJournalFailure,
    cloneJournal,
    cloneJournalSuccess,
    cloneJournalFailure,
    loadJournalByPeriodSuccess,
};
