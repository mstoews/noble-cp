import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./Users.Model";
import { IUser } from "app/models/user";

const getUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
    getUserState, (state) => {
        return state.user;
    }
);

export const getUserById=(uid: string)=>createSelector(getUserState ,(state)=>{
    return state.user.find(( user: IUser)=> user.uid===uid) as IUser;
})


export const selectUserStatus = createSelector(
    getUserState,
    ({ status }) => status
);

export const selectUserError = createSelector(
    getUserState,
    ({ error }) => error
);

export const selectUserIsLoading = createSelector(
    getUserState,
    ({ isLoading }) => isLoading
);

export const selectSelectedUser = createSelector(
    getUserState,
    ({ selectedUser }) => selectedUser
);

export const selectCustomerById = (customerId: string) => 
    createSelector(
      selectUsers,
      (customers: IUser[]) => 
        customers.find(c => c.uid === customerId) 
    );      
        
