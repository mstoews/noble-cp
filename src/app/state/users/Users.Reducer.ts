import { createReducer, on } from '@ngrx/store';
import { addUsersSuccess, deleteUsersSuccess, getUsersSuccess, loadUsersFailure, loadUsersSuccess, updateUsersSuccess } from './Users.Action';
import { userState } from './UsersState';


const usersReducer = createReducer(
    userState,
    on(loadUsersSuccess, (state, action) => {
        return {
            ...state,
            users: action.user,
            error: null,
        }
    }),
    on(loadUsersFailure, (state, action) => {
        return {
            ...state,
            users: [],
            error: action.error,
        }
    }
    ),
    on(deleteUsersSuccess, (state, action) => {
        return {
            ...state,
            users: state.user.filter(x => x.uid !== action.id),
            error: null,
        }
    }),
    on(addUsersSuccess, (state, action) => {
        return {
            ...state,
            users: [...state.user, action.user],
            error: null,
        }
    }),
    on(updateUsersSuccess, (state, action) => {
        return {
            ...state,
            users: state.user.map(x => x.uid === action.user.uid ? action.user.uid : x),
            error: null,
        }
    }),
    on(getUsersSuccess, (state, action) => {
        return {
            ...state,
            account: action.user,
            error: null,
        }
    })

);

export function UsersReducer(state: any, action: any) {
    return usersReducer(state, action);
}


