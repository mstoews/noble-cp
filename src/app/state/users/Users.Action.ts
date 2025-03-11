import { createAction, props } from "@ngrx/store";
import { IUser }  from "app/models/user";

export const LOAD_USERS = 'users getall';
export const LOAD_USERS_SUCCESS = 'users getall success';
export const LOAD_USERS_FAILURE = 'users getall failure'; 


export const LOAD_USERS_DROPDOWN = 'users getDropdown';
export const LOAD_USERS_DROPDOWN_SUCCESS = 'users getDropdown success';
export const LOAD_USERS_DROPDOWN_FAILURE = 'users getDropdown failure'; 


export const DELETE_USERS = 'user delete'
export const DELETE_USERS_SUCCESS = 'user delete success'

export const ADD_USERS = 'user add'
export const ADD_USERS_SUCCESS = 'user add success'

export const UPDATE_USERS = 'user update'
export const UPDATE_USERS_SUCCESS = 'user update success'

export const GET_USERS = 'user get user'

export const loadUsers = createAction(LOAD_USERS);
export const loadUsersSuccess = createAction(LOAD_USERS_SUCCESS, props<{ user: IUser[] }>());
export const loadUsersFailure = createAction(LOAD_USERS_FAILURE, props<{ error: string }>());


export const deleteUsers = createAction(DELETE_USERS, props<{ id: string }>());
export const deleteUsersSuccess = createAction(DELETE_USERS_SUCCESS, props<{ id: string }>());

export const addUsers = createAction(ADD_USERS, props<{ user: IUser }>());
export const addUsersSuccess = createAction(ADD_USERS_SUCCESS, props<{ user: IUser }>());

export const updateUsers = createAction(UPDATE_USERS, props<{ user: IUser }>());
export const updateUsersSuccess = createAction(UPDATE_USERS_SUCCESS, props<{ user: IUser }>());

export const getUser = createAction(GET_USERS, props<{ child: number }>());
export const getUsersSuccess = createAction(UPDATE_USERS_SUCCESS, props<{ user: IUser }>());
export const getUsersFailure = createAction(LOAD_USERS_FAILURE, props<{ error: string }>());

export const emptyAction = createAction('Empty Action');

export const UserActions = {
    loadUsers
};



