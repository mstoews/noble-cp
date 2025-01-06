import { createAction, props } from "@ngrx/store";
import { IJournalDetail, IJournalHeader }  from "app/models/journals";
import { IPeriodParam } from "app/models/period";

export const LOAD_JOURNAL_HEADER = '[JRN_HEADER] getall';
export const LOAD_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] getall success';
export const LOAD_JOURNAL_HEADER_FAILURE = '[JRN_HEADER] getall failure'; 

export const LOAD_JOURNAL_HEADER_BY_PERIOD = '[JRN_HEADER] getJournalHeaderByPeriod';
export const LOAD_JOURNAL_HEADER_BY_PERIOD_SUCCESS = '[JRN_HEADER] getJournalHeaderByPeriod success';
export const LOAD_JOURNAL_HEADER_BY_PERIOD_FAILURE = '[JRN_HEADER] getJournalHeaderByPeriod failure'; 

export const LOAD_PERIOD = '[PERIOD] loadPeriod';
export const LOAD_PERIOD_SUCCESS = '[PERIOD] loadPeriod success';
export const LOAD_PERIOD_FAILURE = '[PERIOD] loadPeriod failure'; 

export const SET_PERIOD = '[PERIOD] setPeriod';
export const SET_PERIOD_SUCCESS = '[PERIOD] setPeriod success';
export const SET_PERIOD_FAILURE = '[PERIOD] setPeriod failure'; 

export const DELETE_JOURNAL_HEADER = '[JRN_HEADER] delete'
export const DELETE_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] delete success'

export const ADD_JOURNAL_HEADER = '[JRN_HEADER] add'
export const ADD_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] add success'

export const UPDATE_JOURNAL_HEADER = '[JRN_HEADER] update'
export const UPDATE_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] update success'

export const GET_JOURNAL_HEADER = '[JRN_HEADER] get jrn_header'
export const GET_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] get journal_header success'
export const GET_JOURNAL_HEADER_FAILURE = '[JRN_HEADER] get journal_header failure'

export const GET_CURRENT_USER = '[CURRENT_USER] get current_user'
export const GET_CURRENT_USER_SUCCESS = '[CURRENT_USER] get current_user success'
export const GET_CURRENT_USER_FAILURE = '[CURRENT_USER] get current_user failure'


export const get_current_user = createAction(GET_CURRENT_USER);
export const get_current_user_success = createAction(GET_CURRENT_USER_SUCCESS, props<{ currentUser: string }>());
export const get_current_user_failure = createAction(GET_CURRENT_USER_FAILURE, props<{ error: string }>());


export const loadJournalHeader = createAction(LOAD_JOURNAL_HEADER);
export const loadJournalHeaderSuccess = createAction(LOAD_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader[] }>());
export const loadJournalHeaderFailure = createAction(LOAD_JOURNAL_HEADER_FAILURE, props<{ error: string }>());


export const loadJournalHeaderByPeriod = createAction(LOAD_JOURNAL_HEADER_BY_PERIOD, props<{ period: IPeriodParam }>());
export const loadJournalHeaderByPeriodSuccess = createAction(LOAD_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader[] }>());
export const loadJournalHeaderByPeriodFailure = createAction(LOAD_JOURNAL_HEADER_FAILURE, props<{ error: string }>());

export const loadPeriod = createAction(LOAD_PERIOD);
export const loadPeriodSuccess = createAction(LOAD_PERIOD_SUCCESS, props<{ period: IPeriodParam }>());
export const loadPeriodFailure = createAction(LOAD_PERIOD_FAILURE, props<{ error: string }>());

export const setPeriod = createAction(SET_PERIOD, props<{ period: IPeriodParam }>());
export const setPeriodSuccess = createAction(SET_PERIOD_SUCCESS, props<{ period: IPeriodParam }>());
export const setPeriodFailure = createAction(SET_PERIOD_FAILURE, props<{ error: string }>());

export const deleteJournalHeader = createAction(DELETE_JOURNAL_HEADER, props<{ id: number }>());
export const deleteJournalHeaderSuccess = createAction(DELETE_JOURNAL_HEADER_SUCCESS, props<{ id: number }>());

export const addJournalHeader = createAction(ADD_JOURNAL_HEADER, props<{ journals: IJournalHeader }>());
export const addJournalHeaderSuccess = createAction(ADD_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader }>());

export const updateJournalHeader = createAction(UPDATE_JOURNAL_HEADER, props<{ journals: IJournalHeader }>());
export const updateJournalHeaderSuccess = createAction(UPDATE_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader }>());

export const getJournalHeader = createAction(GET_JOURNAL_HEADER, props<{ journal_id: number }>());
export const getJournalHeaderSuccess = createAction(GET_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader }>());
export const getJournalHeaderFailure = createAction(GET_JOURNAL_HEADER_FAILURE, props<{ error: string }>());




// Journal Details Actions

export const LOAD_JOURNAL_DETAIL = '[JRN_DETAILS] getall';
export const LOAD_JOURNAL_DETAIL_SUCCESS = '[JRN_DETAILS] getall success';
export const LOAD_JOURNAL_DETAIL_FAILURE = '[JRN_DETAILS] getall failure'; 

export const DELETE_JOURNAL_DETAIL = '[JRN_DETAILS] delete'
export const DELETE_JOURNAL_DETAIL_SUCCESS = '[JRN_DETAILS] delete success'

export const ADD_JOURNAL_DETAIL = '[JRN_DETAILS] add'
export const ADD_JOURNAL_DETAIL_SUCCESS = '[JRN_DETAILS] add success'
export const ADD_JOURNAL_DETAIL_FAILURE = '[JRN_DETAILS] add failure'

export const UPDATE_JOURNAL_DETAIL = '[JRN_DETAILS] update'
export const UPDATE_JOURNAL_DETAIL_SUCCESS = '[JRN_DETAILS] update success'
export const UPDATE_JOURNAL_DETAIL_FAILURE = '[JRN_DETAILS] update failure'

export const GET_JOURNAL_DETAIL = '[JRN_DETAILS] get journal_details'
export const GET_JOURNAL_DETAIL_SUCCESS = '[JRN_DETAILS] get journal_details success'
export const GET_JOURNAL_DETAIL_FAILURE = '[JRN_DETAILS] get journal_details failure'

export const loadJournalDetail = createAction(LOAD_JOURNAL_DETAIL, props<{ journal_id: number }>());
export const loadJournalDetailSuccess = createAction(LOAD_JOURNAL_DETAIL_SUCCESS, props<{ journalDetails: IJournalDetail[] }>());
export const loadJournalDetailFailure = createAction(LOAD_JOURNAL_DETAIL_FAILURE, props<{ error: string }>());

export const deleteJournalDetail = createAction(DELETE_JOURNAL_DETAIL, props<{ id: number }>());
export const deleteJournalDetailSuccess = createAction(DELETE_JOURNAL_DETAIL_SUCCESS, props<{ id: number }>());

export const addJournalDetail = createAction(ADD_JOURNAL_DETAIL, props<{ journalDetails: IJournalDetail }>());
export const addJournalDetailSuccess = createAction(ADD_JOURNAL_DETAIL_SUCCESS, props<{ journalDetails: IJournalDetail }>());

export const updateJournalDetail = createAction(UPDATE_JOURNAL_DETAIL, props<{ journalDetails: IJournalDetail }>());
export const updateJournalDetailSuccess = createAction(UPDATE_JOURNAL_DETAIL_SUCCESS, props<{ journalDetails: IJournalDetail }>());

export const getJournalDetail = createAction(GET_JOURNAL_DETAIL, props<{ journal_id: number }>());
export const getJournalDetailSuccess = createAction(GET_JOURNAL_DETAIL_SUCCESS, props<{ journalDetails: IJournalDetail }>());
export const getJournalDetailFailure = createAction(GET_JOURNAL_DETAIL_FAILURE, props<{ error: string }>());

export const emptyAction = createAction('Empty Action');

export const JournalActions = {
    loadJournalHeader,
    loadJournalHeaderByPeriod,
    loadJournalHeaderSuccess,
    loadJournalHeaderFailure,
    deleteJournalHeader,
    deleteJournalHeaderSuccess,
    addJournalHeader,
    addJournalHeaderSuccess,
    updateJournalHeader,
    updateJournalHeaderSuccess,
    getJournalHeader,
    getJournalHeaderSuccess,
    getJournalHeaderFailure,
    loadJournalDetail,
    loadJournalDetailSuccess,
    loadJournalDetailFailure,
    deleteJournalDetail
};



