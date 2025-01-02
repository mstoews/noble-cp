import { createAction, props } from "@ngrx/store";
import { IJournalDetail, IJournalHeader }  from "app/models/journals";

export const LOAD_JOURNAL_HEADER = '[JRN_HEADER] getall';
export const LOAD_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] getall success';
export const LOAD_JOURNAL_HEADER_FAILURE = '[JRN_HEADER] getall failure'; 

export const DELETE_JOURNAL_HEADER = '[JRN_HEADER] delete'
export const DELETE_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] delete success'

export const ADD_JOURNAL_HEADER = '[JRN_HEADER] add'
export const ADD_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] add success'

export const UPDATE_JOURNAL_HEADER = '[JRN_HEADER] update'
export const UPDATE_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] update success'

export const GET_JOURNAL_HEADER = '[JRN_HEADER] get JRN_HEADER'
export const GET_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] get journal_header success'
export const GET_JOURNAL_HEADER_FAILURE = '[JRN_HEADER] get journal_header failure'

export const loadJournalHeader = createAction(LOAD_JOURNAL_HEADER);
export const loadJournalHeaderSuccess = createAction(LOAD_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader[] }>());
export const loadJournalHeaderFailure = createAction(LOAD_JOURNAL_HEADER_FAILURE, props<{ error: string }>());

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



