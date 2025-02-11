import { createAction, props } from "@ngrx/store";
import { IAccounts } from "app/models";
import { IJournalDetail, IJournalHeader, IJournalTemplate }  from "app/models/journals";
import { IParty } from "app/models/party";
import { IPeriodParam } from "app/models/period";
import { IType } from "app/models/types";


// Load Static Data Actions

export const LOAD_ACCOUNTS = '[ACCOUNTS] load';
export const LOAD_ACCOUNTS_SUCCESS = '[ACCOUNTS] load success';
export const LOAD_ACCOUNTS_FAILURE = '[ACCOUNTS] load failure';

export const LOAD_ACCOUNT_TYPE = '[ACCOUNT_TYPE] load';
export const LOAD_ACCOUNT_TYPE_SUCCESS = '[ACCOUNT_TYPE] load success';
export const LOAD_ACCOUNT_TYPE_FAILURE = '[ACCOUNT_TYPE] load failure';

export const LOAD_PARTY = '[PARTY] load';
export const LOAD_PARTY_SUCCESS = '[PARTY] load success';
export const LOAD_PARTY_FAILURE = '[PARTY] load failure';

export const LOAD_TEMPLATE = '[TEMPLATE] load';
export const LOAD_TEMPLATE_SUCCESS = '[TEMPLATE] load success';
export const LOAD_TEMPLATE_FAILURE = '[TEMPLATE] load failure';

export const loadAccounts = createAction(LOAD_ACCOUNTS);
export const loadAccountsSuccess = createAction(LOAD_ACCOUNTS_SUCCESS, props<{ accounts: IAccounts[] }>());
export const loadAccountsFailure = createAction(LOAD_ACCOUNTS_FAILURE, props<{ error: string }>());

export const loadAccountType = createAction(LOAD_ACCOUNT_TYPE);
export const loadAccountTypeSuccess = createAction(LOAD_ACCOUNT_TYPE_SUCCESS, props<{ account_type: IType[] }>());
export const loadAccountTypeFailure = createAction(LOAD_ACCOUNT_TYPE_FAILURE, props<{ error: string }>());

export const loadParty = createAction(LOAD_PARTY);
export const loadPartySuccess = createAction(LOAD_PARTY_SUCCESS, props<{ party: IParty[] }>());
export const loadPartyFailure = createAction(LOAD_PARTY_FAILURE, props<{ error: string }>());

export const loadTemplate = createAction(LOAD_TEMPLATE);
export const loadTemplateSuccess = createAction(LOAD_TEMPLATE_SUCCESS, props<{ template: IJournalTemplate[] }>());
export const loadTemplateFailure = createAction(LOAD_TEMPLATE_FAILURE, props<{ error: string }>());


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

export const CLONE_JOURNAL = '[JRN_CLONE] clone'
export const CLONE_JOURNAL_SUCCESS = '[JRN_CLONE] clone success'
export const CLONE_JOURNAL_FAILURE = '[JRN_CLONE] clone failure'


export const GET_JOURNAL_HEADER = '[JRN_HEADER] get jrn_header'
export const GET_JOURNAL_HEADER_SUCCESS = '[JRN_HEADER] get journal_header success'
export const GET_JOURNAL_HEADER_FAILURE = '[JRN_HEADER] get journal_header failure'
export const GET_JOURNAL_ACTIVE_JOURNAL = '[JRN_HEADER] get active journal'

export const getActiveJournal  = createAction(GET_JOURNAL_ACTIVE_JOURNAL, props<{ activeJournalId: number }>());

export const loadJournalHeader = createAction(LOAD_JOURNAL_HEADER);
export const loadJournalHeaderSuccess = createAction(LOAD_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader[] }>());
export const loadJournalHeaderFailure = createAction(LOAD_JOURNAL_HEADER_FAILURE, props<{ error: string }>());

export const cloneJournal = createAction(CLONE_JOURNAL, props<{ journal_id: number }>());
export const cloneJournalSuccess = createAction(GET_JOURNAL_HEADER_SUCCESS, props<{ journals: IJournalHeader}>() );
export const cloneJournalFailure = createAction(GET_JOURNAL_HEADER_FAILURE, props<{ error: string }>());


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
    deleteJournalDetail,
    cloneJournal,
    cloneJournalSuccess,
    cloneJournalFailure,
    loadJournalHeaderByPeriodSuccess,
    setPeriod,
    setPeriodSuccess,
    setPeriodFailure,
    loadPeriod,
    loadPeriodSuccess,
    loadPeriodFailure,
    addJournalDetail,
    addJournalDetailSuccess,

};

export const JournalStaticDataActions = {
    loadAccounts,
    loadAccountsSuccess,
    loadAccountsFailure,
    loadAccountType,
    loadAccountTypeSuccess,
    loadAccountTypeFailure,
    loadParty,
    loadPartySuccess,
    loadPartyFailure,
    loadTemplate,
    loadTemplateSuccess,
    loadTemplateFailure
};



