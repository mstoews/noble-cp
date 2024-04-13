import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any; }
};

export type KanbanInputs = {
  Id?: InputMaybe<Scalars['Float']['input']>;
  assignee?: InputMaybe<Scalars['String']['input']>;
  classname?: InputMaybe<Scalars['String']['input']>;
  client_ref?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  dependencies?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['DateTime']['input']>;
  estimate?: InputMaybe<Scalars['Float']['input']>;
  parentId?: InputMaybe<Scalars['Float']['input']>;
  party_ref: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  rankid?: InputMaybe<Scalars['Float']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['String']['input']>;
  task_id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  GLAccountCreate: Gl_Trial_Balance;
  GLAccountUpdate: Gl_Trial_Balance;
  GeneralLedgerAccountDelete: Gl_Trial_Balance;
  copyTask: Kb_Task;
  createKanbanAssignee: TeamModel;
  createKanbanPriority: Kb_Priority;
  createKanbanStatus: Kb_Status;
  createKanbanType: Kb_Type;
  createSubTask: SubTasks;
  createTask: Kb_Task;
  deleteKanbanAssignee: TeamModel;
  deleteKanbanPriority: Kb_Priority;
  deleteKanbanStatus: Kb_Status;
  deleteKanbanSubTask: SubTasks;
  deleteKanbanType: Kb_Type;
  deleteTask: Kb_Task;
  gl_types_create: Gl_Account_Type;
  gl_types_delete: Gl_Account_Type;
  gl_types_update: Gl_Account_Type;
  login: Login_Response;
  signup: User;
  updateKanbanAssignee: TeamModel;
  updateKanbanPriority: Kb_Priority;
  updateKanbanStatus: Kb_Status;
  updateKanbanType: Kb_Type;
  updateTask: Kb_Task;
  updateTaskDependency: Kb_Task;
  updateTaskParentId: Kb_Task;
  user_create: User;
};


export type MutationGlAccountCreateArgs = {
  generalLedgerData: Gl_Trial_BalanceCreateInput;
};


export type MutationGlAccountUpdateArgs = {
  account: Scalars['String']['input'];
  child: Scalars['String']['input'];
  gl_trial_balanceUpdateInput: Gl_Trial_BalanceUpdateInput;
};


export type MutationGeneralLedgerAccountDeleteArgs = {
  account: Scalars['String']['input'];
  child: Scalars['String']['input'];
};


export type MutationCopyTaskArgs = {
  data: KanbanInputs;
};


export type MutationCreateKanbanAssigneeArgs = {
  data: TeamInputs;
};


export type MutationCreateKanbanPriorityArgs = {
  kanbanData: TaskPriorityInputs;
};


export type MutationCreateKanbanStatusArgs = {
  data: TaskStatusInputs;
};


export type MutationCreateKanbanTypeArgs = {
  data: TaskStatusInputs;
};


export type MutationCreateSubTaskArgs = {
  data: SubTaskInputs;
};


export type MutationCreateTaskArgs = {
  data: KanbanInputs;
};


export type MutationDeleteKanbanAssigneeArgs = {
  team_member: Scalars['String']['input'];
};


export type MutationDeleteKanbanPriorityArgs = {
  priority: Scalars['String']['input'];
};


export type MutationDeleteKanbanStatusArgs = {
  status: Scalars['String']['input'];
};


export type MutationDeleteKanbanSubTaskArgs = {
  subid: Scalars['String']['input'];
  task_id: Scalars['String']['input'];
};


export type MutationDeleteKanbanTypeArgs = {
  type: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  task_id: Scalars['String']['input'];
};


export type MutationGl_Types_CreateArgs = {
  typeData: Gl_Account_TypeCreateInput;
};


export type MutationGl_Types_DeleteArgs = {
  type: Scalars['String']['input'];
};


export type MutationGl_Types_UpdateArgs = {
  gl_account_typeUpdateInput: Gl_Account_TypeUpdateInput;
  type: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  generalLedgerData: UserCreateInput;
};


export type MutationUpdateKanbanAssigneeArgs = {
  data: TeamInputs;
  team_member: Scalars['String']['input'];
};


export type MutationUpdateKanbanPriorityArgs = {
  kanbanData: TaskPriorityInputs;
  priority: Scalars['String']['input'];
};


export type MutationUpdateKanbanStatusArgs = {
  id: Scalars['String']['input'];
  newData: TaskStatusInputs;
};


export type MutationUpdateKanbanTypeArgs = {
  newData: TaskStatusInputs;
  type: Scalars['String']['input'];
};


export type MutationUpdateTaskArgs = {
  newData: KanbanInputs;
  task_id: Scalars['String']['input'];
};


export type MutationUpdateTaskDependencyArgs = {
  dependency: Scalars['String']['input'];
  task_id: Scalars['String']['input'];
};


export type MutationUpdateTaskParentIdArgs = {
  parentId: Scalars['Float']['input'];
  task_id: Scalars['String']['input'];
};


export type MutationUser_CreateArgs = {
  userData: UserCreateInput;
};

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NullableDecimalFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Decimal']['input']>;
  divide?: InputMaybe<Scalars['Decimal']['input']>;
  increment?: InputMaybe<Scalars['Decimal']['input']>;
  multiply?: InputMaybe<Scalars['Decimal']['input']>;
  set?: InputMaybe<Scalars['Decimal']['input']>;
};

export type NullableIntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']['input']>;
  divide?: InputMaybe<Scalars['Int']['input']>;
  increment?: InputMaybe<Scalars['Int']['input']>;
  multiply?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
};

export type NullableStringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  KanbanAssignee: Array<TeamModel>;
  KanbanAssigneeById: Array<TeamModel>;
  KanbanByTaskId: Array<Kb_Task>;
  KanbanFirstTask: Kb_Task;
  KanbanPriority: Array<Kb_Priority>;
  KanbanPriorityById: Array<Kb_Priority>;
  KanbanStatus: Array<Kb_Status>;
  KanbanStatusById: Array<Kb_Status>;
  KanbanTask: Array<Kb_Task>;
  KanbanTaskByRef: Array<Kb_Task>;
  KanbanTaskByRefAndStatus: Array<Kb_Task>;
  KanbanTaskByStatus: Array<Kb_Task>;
  KanbanTaskByTaskId: Kb_Task;
  KanbanTasksNotCompleted: Array<Kb_Task>;
  KanbanType: Array<Kb_Type>;
  KanbanTypeById: Array<Kb_Type>;
  KanbanUniqueByTaskId: Kb_Task;
  SubTaskById: Array<SubTasks>;
  SubTasks: Array<SubTasks>;
  SubTasksByTaskId: Array<SubTasks>;
  gl_account_by: Array<Gl_Trial_Balance>;
  gl_accounts: Array<Gl_Accounts>;
  gl_journal_detail: Array<Gl_Journal_Detail>;
  gl_journal_detail_by_id: Array<Gl_Journal_Detail>;
  gl_journal_header: Array<Gl_Journal_Header>;
  gl_trial_balance: Array<Gl_Trial_Balance>;
  gl_types: Array<Gl_Account_Type>;
  users: Array<User>;
};


export type QueryKanbanAssigneeByIdArgs = {
  team_member: Scalars['String']['input'];
};


export type QueryKanbanByTaskIdArgs = {
  task_id: Scalars['String']['input'];
};


export type QueryKanbanFirstTaskArgs = {
  party_ref: Scalars['String']['input'];
};


export type QueryKanbanPriorityByIdArgs = {
  priority: Scalars['String']['input'];
};


export type QueryKanbanStatusByIdArgs = {
  status: Scalars['String']['input'];
};


export type QueryKanbanTaskByRefArgs = {
  partyRef: Scalars['String']['input'];
};


export type QueryKanbanTaskByRefAndStatusArgs = {
  partyRef: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type QueryKanbanTaskByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QueryKanbanTaskByTaskIdArgs = {
  task_id: Scalars['String']['input'];
};


export type QueryKanbanTasksNotCompletedArgs = {
  partyRef: Scalars['String']['input'];
};


export type QueryKanbanTypeByIdArgs = {
  type: Scalars['String']['input'];
};


export type QueryKanbanUniqueByTaskIdArgs = {
  task_id: Scalars['String']['input'];
};


export type QuerySubTaskByIdArgs = {
  subid: Scalars['String']['input'];
  task_id: Scalars['String']['input'];
};


export type QuerySubTasksByTaskIdArgs = {
  task_id: Scalars['String']['input'];
};


export type QueryGl_Account_ByArgs = {
  account: Scalars['String']['input'];
};


export type QueryGl_Journal_Detail_By_IdArgs = {
  journal_id: Scalars['Float']['input'];
};

export type StringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export type SubTaskInputs = {
  desc?: InputMaybe<Scalars['String']['input']>;
  estimate?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subid: Scalars['String']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
  task_id: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SubTasks = {
  __typename?: 'SubTasks';
  desc?: Maybe<Scalars['String']['output']>;
  estimate: Scalars['Int']['output'];
  status?: Maybe<Scalars['String']['output']>;
  subid: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  task_id: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type TaskPriorityInputs = {
  description: Scalars['String']['input'];
  priority: Scalars['String']['input'];
  updatedte: Scalars['DateTime']['input'];
  updateusr: Scalars['String']['input'];
};

export type TaskStatusInputs = {
  description: Scalars['String']['input'];
  status: Scalars['String']['input'];
  updatedte: Scalars['DateTime']['input'];
  updateusr: Scalars['String']['input'];
};

export type TeamInputs = {
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  location: Scalars['String']['input'];
  team_member: Scalars['String']['input'];
  title: Scalars['String']['input'];
  updatedte: Scalars['DateTime']['input'];
  updateusr: Scalars['String']['input'];
};

export type TeamModel = {
  __typename?: 'TeamModel';
  first_name: Scalars['String']['output'];
  last_name: Scalars['String']['output'];
  location: Scalars['String']['output'];
  team_member: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedte: Scalars['DateTime']['output'];
  updateusr: Scalars['String']['output'];
};

export type Gl_Account_Type = {
  __typename?: 'gl_account_type';
  create_date?: Maybe<Scalars['DateTime']['output']>;
  create_user?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  type: Scalars['ID']['output'];
  update_date?: Maybe<Scalars['DateTime']['output']>;
  update_user?: Maybe<Scalars['String']['output']>;
};

export type Gl_Account_TypeCreateInput = {
  create_date?: InputMaybe<Scalars['DateTime']['input']>;
  create_user?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  update_date?: InputMaybe<Scalars['DateTime']['input']>;
  update_user?: InputMaybe<Scalars['String']['input']>;
};

export type Gl_Account_TypeUpdateInput = {
  create_date?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  create_user?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  update_date?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  update_user?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type Gl_Accounts = {
  __typename?: 'gl_accounts';
  account: Scalars['String']['output'];
  balance?: Maybe<Scalars['Decimal']['output']>;
  capital_asset_fund?: Maybe<Scalars['Boolean']['output']>;
  child: Scalars['String']['output'];
  comments?: Maybe<Scalars['String']['output']>;
  create_date?: Maybe<Scalars['DateTime']['output']>;
  create_user?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  reserve_fund?: Maybe<Scalars['Boolean']['output']>;
  special_assessment?: Maybe<Scalars['Boolean']['output']>;
  sub_type?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  update_date?: Maybe<Scalars['DateTime']['output']>;
  update_user?: Maybe<Scalars['String']['output']>;
};

export type Gl_Journal_Detail = {
  __typename?: 'gl_journal_detail';
  account?: Maybe<Scalars['String']['output']>;
  child?: Maybe<Scalars['String']['output']>;
  create_date?: Maybe<Scalars['DateTime']['output']>;
  create_user?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['Decimal']['output']>;
  debit?: Maybe<Scalars['Decimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  journal_id: Scalars['Int']['output'];
  journal_subid: Scalars['Int']['output'];
};

export type Gl_Journal_Header = {
  __typename?: 'gl_journal_header';
  booked?: Maybe<Scalars['Boolean']['output']>;
  booked_date?: Maybe<Scalars['DateTime']['output']>;
  booked_user?: Maybe<Scalars['String']['output']>;
  create_date?: Maybe<Scalars['DateTime']['output']>;
  create_user?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  journal_id: Scalars['ID']['output'];
};

export type Gl_Trial_Balance = {
  __typename?: 'gl_trial_balance';
  account: Scalars['String']['output'];
  accounting_period_id?: Maybe<Scalars['Int']['output']>;
  child: Scalars['String']['output'];
  create_date?: Maybe<Scalars['DateTime']['output']>;
  create_user?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['Decimal']['output']>;
  debit?: Maybe<Scalars['Decimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end_date?: Maybe<Scalars['DateTime']['output']>;
  start_date?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  update_date?: Maybe<Scalars['DateTime']['output']>;
  update_user?: Maybe<Scalars['String']['output']>;
};

export type Gl_Trial_BalanceCreateInput = {
  account: Scalars['String']['input'];
  accounting_period_id?: InputMaybe<Scalars['Int']['input']>;
  child: Scalars['String']['input'];
  create_date?: InputMaybe<Scalars['DateTime']['input']>;
  create_user?: InputMaybe<Scalars['String']['input']>;
  credit?: InputMaybe<Scalars['Decimal']['input']>;
  debit?: InputMaybe<Scalars['Decimal']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['DateTime']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  update_date?: InputMaybe<Scalars['DateTime']['input']>;
  update_user?: InputMaybe<Scalars['String']['input']>;
};

export type Gl_Trial_BalanceUpdateInput = {
  account?: InputMaybe<StringFieldUpdateOperationsInput>;
  accounting_period_id?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  child?: InputMaybe<StringFieldUpdateOperationsInput>;
  create_date?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  create_user?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  credit?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  debit?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  end_date?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  start_date?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  update_date?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  update_user?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type Kb_Comment = {
  __typename?: 'kb_comment';
  comment_text: Scalars['String']['output'];
  image_url: Scalars['String']['output'];
  party_ref: Scalars['String']['output'];
  task_id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedte: Scalars['DateTime']['output'];
  updateusr: Scalars['String']['output'];
};

export type Kb_Priority = {
  __typename?: 'kb_priority';
  description: Scalars['String']['output'];
  priority: Scalars['String']['output'];
  updatedte: Scalars['DateTime']['output'];
  updateusr: Scalars['String']['output'];
};

export type Kb_Status = {
  __typename?: 'kb_status';
  description: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedte: Scalars['DateTime']['output'];
  updateusr: Scalars['String']['output'];
};

export type Kb_Task = {
  __typename?: 'kb_task';
  Comment: Array<Kb_Comment>;
  Id?: Maybe<Scalars['Float']['output']>;
  Priority: Array<Kb_Priority>;
  Status: Array<Kb_Status>;
  Type: Array<Kb_Type>;
  assignee?: Maybe<Scalars['String']['output']>;
  classname?: Maybe<Scalars['String']['output']>;
  client_ref: Scalars['String']['output'];
  color?: Maybe<Scalars['String']['output']>;
  dependencies?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  due_date?: Maybe<Scalars['DateTime']['output']>;
  estimate?: Maybe<Scalars['Float']['output']>;
  parentId?: Maybe<Scalars['Float']['output']>;
  party_ref: Scalars['String']['output'];
  priority?: Maybe<Scalars['String']['output']>;
  rankid?: Maybe<Scalars['Float']['output']>;
  start_date?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subtasks: Array<SubTasks>;
  summary?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Scalars['String']['output']>;
  task_id: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Kb_Type = {
  __typename?: 'kb_type';
  description: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedte: Scalars['DateTime']['output'];
  updateusr: Scalars['String']['output'];
};

export type Login_Response = {
  __typename?: 'login_response';
  access_token?: Maybe<Scalars['String']['output']>;
  refresh_token?: Maybe<Scalars['String']['output']>;
  username: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'user';
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  hashed_password: Scalars['String']['output'];
  lastname: Scalars['String']['output'];
  password_changed_at: Scalars['DateTime']['output'];
  username: Scalars['ID']['output'];
};

export type UserCreateInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  hashed_password: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password_changed_at?: InputMaybe<Scalars['DateTime']['input']>;
  username: Scalars['String']['input'];
};

export type Gl_Trial_BalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type Gl_Trial_BalanceQuery = { __typename?: 'Query', gl_trial_balance: Array<{ __typename?: 'gl_trial_balance', account: string, child: string, start_date?: any | null, end_date?: any | null, accounting_period_id?: number | null, description?: string | null, type?: string | null, debit?: any | null, credit?: any | null, create_date?: any | null, create_user?: string | null, update_date?: any | null, update_user?: string | null }> };

export type GetAllAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAccountsQuery = { __typename?: 'Query', gl_accounts: Array<{ __typename?: 'gl_accounts', account: string, child: string, description?: string | null, balance?: any | null, type?: string | null, sub_type?: boolean | null, special_assessment?: boolean | null, capital_asset_fund?: boolean | null, reserve_fund?: boolean | null, comments?: string | null, create_date?: any | null, create_user?: string | null }> };

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = { __typename?: 'Query', KanbanTask: Array<{ __typename?: 'kb_task', task_id: string, title?: string | null }> };

export type Journal_HeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type Journal_HeaderQuery = { __typename?: 'Query', gl_journal_header: Array<{ __typename?: 'gl_journal_header', journal_id: string, description?: string | null, booked?: boolean | null, create_date?: any | null, create_user?: string | null, booked_date?: any | null, booked_user?: string | null }> };

export type Journal_DetailQueryVariables = Exact<{
  journal_id: Scalars['Float']['input'];
}>;


export type Journal_DetailQuery = { __typename?: 'Query', gl_journal_detail_by_id: Array<{ __typename?: 'gl_journal_detail', journal_id: number, journal_subid: number, account?: string | null, child?: string | null, description?: string | null, debit?: any | null, credit?: any | null, create_date?: any | null, create_user?: string | null }> };

export type Gl_TypesQueryVariables = Exact<{ [key: string]: never; }>;


export type Gl_TypesQuery = { __typename?: 'Query', gl_types: Array<{ __typename?: 'gl_account_type', type: string, description?: string | null, create_date?: any | null, create_user?: string | null, update_date?: any | null, update_user?: string | null }> };

export type KanbanTaskFragment = { __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null };

export type KanbanTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type KanbanTasksQuery = { __typename?: 'Query', KanbanTask: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type KanbanPriorityQueryVariables = Exact<{ [key: string]: never; }>;


export type KanbanPriorityQuery = { __typename?: 'Query', KanbanPriority: Array<{ __typename?: 'kb_priority', priority: string, description: string, updatedte: any, updateusr: string }> };

export type KanbanTypeQueryVariables = Exact<{ [key: string]: never; }>;


export type KanbanTypeQuery = { __typename?: 'Query', KanbanType: Array<{ __typename?: 'kb_type', type: string, description: string, updatedte: any, updateusr: string }> };

export type KanbanStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type KanbanStatusQuery = { __typename?: 'Query', KanbanStatus: Array<{ __typename?: 'kb_status', status: string, description: string, updatedte: any, updateusr: string }> };

export type KanbanTaskByTaskIdQueryVariables = Exact<{
  task_id: Scalars['String']['input'];
}>;


export type KanbanTaskByTaskIdQuery = { __typename?: 'Query', KanbanByTaskId: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type KanbanTaskByStatusQueryVariables = Exact<{
  status: Scalars['String']['input'];
}>;


export type KanbanTaskByStatusQuery = { __typename?: 'Query', KanbanTaskByStatus: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type KanbanByTaskIdQueryVariables = Exact<{
  task_id: Scalars['String']['input'];
}>;


export type KanbanByTaskIdQuery = { __typename?: 'Query', KanbanByTaskId: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type KanbanTaskByRefAndStatusQueryVariables = Exact<{
  partyRef: Scalars['String']['input'];
  status: Scalars['String']['input'];
}>;


export type KanbanTaskByRefAndStatusQuery = { __typename?: 'Query', KanbanTaskByRefAndStatus: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type KanbanTaskByRefQueryVariables = Exact<{
  party_ref: Scalars['String']['input'];
}>;


export type KanbanTaskByRefQuery = { __typename?: 'Query', KanbanTaskByRef: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type KanbanByStatusQueryVariables = Exact<{
  status: Scalars['String']['input'];
}>;


export type KanbanByStatusQuery = { __typename?: 'Query', KanbanTaskByStatus: Array<{ __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null }> };

export type CreateKanbanTaskMutationVariables = Exact<{
  taskInput: KanbanInputs;
}>;


export type CreateKanbanTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null } };

export type UpdateTaskMutationVariables = Exact<{
  task_id: Scalars['String']['input'];
  taskInput: KanbanInputs;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask: { __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null } };

export type DeleteTaskMutationVariables = Exact<{
  task_id: Scalars['String']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: { __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null } };

export type KanbanFirstTaskQueryVariables = Exact<{
  party_ref: Scalars['String']['input'];
}>;


export type KanbanFirstTaskQuery = { __typename?: 'Query', KanbanFirstTask: { __typename?: 'kb_task', Id?: number | null, assignee?: string | null, due_date?: any | null, start_date?: any | null, description?: string | null, dependencies?: string | null, rankid?: number | null, task_id: string, title?: string | null, estimate?: number | null, status?: string | null, summary?: string | null, classname?: string | null, priority?: string | null, type?: string | null, color?: string | null, tags?: string | null } };

export type UpdateTaskParentIdMutationVariables = Exact<{
  task_id: Scalars['String']['input'];
  parentId: Scalars['Float']['input'];
}>;


export type UpdateTaskParentIdMutation = { __typename?: 'Mutation', updateTaskParentId: { __typename?: 'kb_task', task_id: string, parentId?: number | null } };

export const KanbanTaskFragmentDoc = gql`
    fragment KanbanTask on kb_task {
  Id
  assignee
  due_date
  start_date
  description
  dependencies
  rankid
  task_id
  title
  assignee
  estimate
  status
  summary
  classname
  priority
  type
  color
  tags
  classname
}
    `;
export const Gl_Trial_BalanceDocument = gql`
    query gl_trial_balance {
  gl_trial_balance {
    account
    child
    start_date
    end_date
    accounting_period_id
    description
    type
    debit
    credit
    create_date
    create_user
    update_date
    update_user
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Gl_Trial_BalanceGQL extends Apollo.Query<Gl_Trial_BalanceQuery, Gl_Trial_BalanceQueryVariables> {
    document = Gl_Trial_BalanceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllAccountsDocument = gql`
    query getAllAccounts {
  gl_accounts {
    account
    child
    description
    balance
    type
    sub_type
    special_assessment
    capital_asset_fund
    reserve_fund
    comments
    create_date
    create_user
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllAccountsGQL extends Apollo.Query<GetAllAccountsQuery, GetAllAccountsQueryVariables> {
    document = GetAllAccountsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TasksDocument = gql`
    query tasks {
  KanbanTask {
    task_id
    title
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TasksGQL extends Apollo.Query<TasksQuery, TasksQueryVariables> {
    document = TasksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Journal_HeaderDocument = gql`
    query journal_header {
  gl_journal_header {
    journal_id
    description
    booked
    create_date
    create_user
    booked_date
    booked_user
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Journal_HeaderGQL extends Apollo.Query<Journal_HeaderQuery, Journal_HeaderQueryVariables> {
    document = Journal_HeaderDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Journal_DetailDocument = gql`
    query journal_detail($journal_id: Float!) {
  gl_journal_detail_by_id(journal_id: $journal_id) {
    journal_id
    journal_subid
    account
    child
    description
    debit
    credit
    create_date
    create_user
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Journal_DetailGQL extends Apollo.Query<Journal_DetailQuery, Journal_DetailQueryVariables> {
    document = Journal_DetailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Gl_TypesDocument = gql`
    query gl_types {
  gl_types {
    type
    description
    create_date
    create_user
    update_date
    update_user
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Gl_TypesGQL extends Apollo.Query<Gl_TypesQuery, Gl_TypesQueryVariables> {
    document = Gl_TypesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanTasksDocument = gql`
    query KanbanTasks {
  KanbanTask {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanTasksGQL extends Apollo.Query<KanbanTasksQuery, KanbanTasksQueryVariables> {
    document = KanbanTasksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanPriorityDocument = gql`
    query KanbanPriority {
  KanbanPriority {
    priority
    description
    updatedte
    updateusr
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanPriorityGQL extends Apollo.Query<KanbanPriorityQuery, KanbanPriorityQueryVariables> {
    document = KanbanPriorityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanTypeDocument = gql`
    query KanbanType {
  KanbanType {
    type
    description
    updatedte
    updateusr
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanTypeGQL extends Apollo.Query<KanbanTypeQuery, KanbanTypeQueryVariables> {
    document = KanbanTypeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanStatusDocument = gql`
    query KanbanStatus {
  KanbanStatus {
    status
    description
    updatedte
    updateusr
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanStatusGQL extends Apollo.Query<KanbanStatusQuery, KanbanStatusQueryVariables> {
    document = KanbanStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanTaskByTaskIdDocument = gql`
    query KanbanTaskByTaskId($task_id: String!) {
  KanbanByTaskId(task_id: $task_id) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanTaskByTaskIdGQL extends Apollo.Query<KanbanTaskByTaskIdQuery, KanbanTaskByTaskIdQueryVariables> {
    document = KanbanTaskByTaskIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanTaskByStatusDocument = gql`
    query KanbanTaskByStatus($status: String!) {
  KanbanTaskByStatus(status: $status) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanTaskByStatusGQL extends Apollo.Query<KanbanTaskByStatusQuery, KanbanTaskByStatusQueryVariables> {
    document = KanbanTaskByStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanByTaskIdDocument = gql`
    query KanbanByTaskId($task_id: String!) {
  KanbanByTaskId(task_id: $task_id) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanByTaskIdGQL extends Apollo.Query<KanbanByTaskIdQuery, KanbanByTaskIdQueryVariables> {
    document = KanbanByTaskIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanTaskByRefAndStatusDocument = gql`
    query KanbanTaskByRefAndStatus($partyRef: String!, $status: String!) {
  KanbanTaskByRefAndStatus(partyRef: $partyRef, status: $status) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanTaskByRefAndStatusGQL extends Apollo.Query<KanbanTaskByRefAndStatusQuery, KanbanTaskByRefAndStatusQueryVariables> {
    document = KanbanTaskByRefAndStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanTaskByRefDocument = gql`
    query KanbanTaskByRef($party_ref: String!) {
  KanbanTaskByRef(partyRef: $party_ref) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanTaskByRefGQL extends Apollo.Query<KanbanTaskByRefQuery, KanbanTaskByRefQueryVariables> {
    document = KanbanTaskByRefDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanByStatusDocument = gql`
    query KanbanByStatus($status: String!) {
  KanbanTaskByStatus(status: $status) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanByStatusGQL extends Apollo.Query<KanbanByStatusQuery, KanbanByStatusQueryVariables> {
    document = KanbanByStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateKanbanTaskDocument = gql`
    mutation createKanbanTask($taskInput: KanbanInputs!) {
  createTask(data: $taskInput) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateKanbanTaskGQL extends Apollo.Mutation<CreateKanbanTaskMutation, CreateKanbanTaskMutationVariables> {
    document = CreateKanbanTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateTaskDocument = gql`
    mutation UpdateTask($task_id: String!, $taskInput: KanbanInputs!) {
  updateTask(task_id: $task_id, newData: $taskInput) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateTaskGQL extends Apollo.Mutation<UpdateTaskMutation, UpdateTaskMutationVariables> {
    document = UpdateTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteTaskDocument = gql`
    mutation deleteTask($task_id: String!) {
  deleteTask(task_id: $task_id) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteTaskGQL extends Apollo.Mutation<DeleteTaskMutation, DeleteTaskMutationVariables> {
    document = DeleteTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const KanbanFirstTaskDocument = gql`
    query KanbanFirstTask($party_ref: String!) {
  KanbanFirstTask(party_ref: $party_ref) {
    ...KanbanTask
  }
}
    ${KanbanTaskFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class KanbanFirstTaskGQL extends Apollo.Query<KanbanFirstTaskQuery, KanbanFirstTaskQueryVariables> {
    document = KanbanFirstTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateTaskParentIdDocument = gql`
    mutation updateTaskParentId($task_id: String!, $parentId: Float!) {
  updateTaskParentId(task_id: $task_id, parentId: $parentId) {
    task_id
    parentId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateTaskParentIdGQL extends Apollo.Mutation<UpdateTaskParentIdMutation, UpdateTaskParentIdMutationVariables> {
    document = UpdateTaskParentIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }