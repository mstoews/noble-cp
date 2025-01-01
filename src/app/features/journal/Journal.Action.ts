import { createAction, props } from "@ngrx/store";
import { IJournalDetail, IJournalHeader }  from "app/models/journals";

export const LOAD_JOURNAL_HEADER = '[journal_headers] getall';
export const LOAD_JOURNAL_HEADER_SUCCESS = '[journal_headers] getall success';
export const LOAD_JOURNAL_HEADER_FAILURE = '[journal_headers] getall failure'; 

export const DELETE_JOURNAL_HEADER = '[journal_header] delete'
export const DELETE_JOURNAL_HEADER_SUCCESS = '[journal_header] delete success'

export const ADD_JOURNAL_HEADER = '[journal_header] add'
export const ADD_JOURNAL_HEADER_SUCCESS = '[journal_header] add success'

export const UPDATE_JOURNAL_HEADER = '[journal_header] update'
export const UPDATE_JOURNAL_HEADER_SUCCESS = '[journal_header] update success'

export const GET_JOURNAL_HEADER = '[journal_header] get journal_header'
export const GET_JOURNAL_HEADER_SUCCESS = '[journal_header] get journal_header success'
export const GET_JOURNAL_HEADER_FAILURE = '[journal_header] get journal_header failure'

export const loadJournalHeader = createAction(LOAD_JOURNAL_HEADER);
export const loadJournalHeaderSuccess = createAction(LOAD_JOURNAL_HEADER_SUCCESS, props<{ journal_headers: IJournalHeader[] }>());
export const loadJournalHeaderFailure = createAction(LOAD_JOURNAL_HEADER_FAILURE, props<{ error: string }>());

export const deleteJournalHeader = createAction(DELETE_JOURNAL_HEADER, props<{ id: number }>());
export const deleteJournalHeaderSuccess = createAction(DELETE_JOURNAL_HEADER_SUCCESS, props<{ id: number }>());

export const addJournalHeader = createAction(ADD_JOURNAL_HEADER, props<{ journal_header: IJournalHeader }>());
export const addJournalHeaderSuccess = createAction(ADD_JOURNAL_HEADER_SUCCESS, props<{ journal_header: IJournalHeader }>());

export const updateJournalHeader = createAction(UPDATE_JOURNAL_HEADER, props<{ journal_header: IJournalHeader }>());
export const updateJournalHeaderSuccess = createAction(UPDATE_JOURNAL_HEADER_SUCCESS, props<{ journal_header: IJournalHeader }>());

export const getJournalHeader = createAction(GET_JOURNAL_HEADER, props<{ journal_id: number }>());
export const getJournalHeaderSuccess = createAction(GET_JOURNAL_HEADER_SUCCESS, props<{ journal_header: IJournalHeader }>());
export const getJournalHeaderFailure = createAction(GET_JOURNAL_HEADER_FAILURE, props<{ error: string }>());


// Journal Details Actions

export const LOAD_JOURNAL_DETAIL = '[journal_details] getall';
export const LOAD_JOURNAL_DETAIL_SUCCESS = '[journal_details] getall success';
export const LOAD_JOURNAL_DETAIL_FAILURE = '[journal_details] getall failure'; 

export const DELETE_JOURNAL_DETAIL = '[journal_details] delete'
export const DELETE_JOURNAL_DETAIL_SUCCESS = '[journal_details] delete success'

export const ADD_JOURNAL_DETAIL = '[journal_details] add'
export const ADD_JOURNAL_DETAIL_SUCCESS = '[journal_details] add success'
export const ADD_JOURNAL_DETAIL_FAILURE = '[journal_details] add failure'

export const UPDATE_JOURNAL_DETAIL = '[journal_details] update'
export const UPDATE_JOURNAL_DETAIL_SUCCESS = '[journal_details] update success'
export const UPDATE_JOURNAL_DETAIL_FAILURE = '[journal_details] update failure'

export const GET_JOURNAL_DETAIL = '[journal_details] get journal_details'
export const GET_JOURNAL_DETAIL_SUCCESS = '[journal_details] get journal_details success'
export const GET_JOURNAL_DETAIL_FAILURE = '[journal_details] get journal_details failure'

export const loadJournalDetail = createAction(LOAD_JOURNAL_DETAIL, props<{ journal_id: number }>());
export const loadJournalDetailSuccess = createAction(LOAD_JOURNAL_DETAIL_SUCCESS, props<{ journal_details: IJournalDetail[] }>());
export const loadJournalDetailFailure = createAction(LOAD_JOURNAL_DETAIL_FAILURE, props<{ error: string }>());

export const deleteJournalDetail = createAction(DELETE_JOURNAL_DETAIL, props<{ id: number }>());
export const deleteJournalDetailSuccess = createAction(DELETE_JOURNAL_DETAIL_SUCCESS, props<{ id: number }>());

export const addJournalDetail = createAction(ADD_JOURNAL_DETAIL, props<{ journal_details: IJournalDetail }>());
export const addJournalDetailSuccess = createAction(ADD_JOURNAL_DETAIL_SUCCESS, props<{ journal_details: IJournalDetail }>());

export const updateJournalDetail = createAction(UPDATE_JOURNAL_DETAIL, props<{ journal_details: IJournalDetail }>());
export const updateJournalDetailSuccess = createAction(UPDATE_JOURNAL_DETAIL_SUCCESS, props<{ journal_details: IJournalDetail }>());

export const getJournalDetail = createAction(GET_JOURNAL_DETAIL, props<{ journal_id: number }>());
export const getJournalDetailSuccess = createAction(GET_JOURNAL_DETAIL_SUCCESS, props<{ journal_details: IJournalDetail }>());
export const getJournalDetailFailure = createAction(GET_JOURNAL_DETAIL_FAILURE, props<{ error: string }>());

export const emptyAction = createAction('Empty Action');

export const AccountActions = {
    loadJournalHeader
};



