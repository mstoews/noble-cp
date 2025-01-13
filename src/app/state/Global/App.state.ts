import { JournalReducer } from "../journal/Journal.Reducer";
import { UsersReducer } from "../users/Users.Reducer";
import { AppReducer } from "./App.Reducer";
import { routerReducer} from '@ngrx/router-store'

export const AppState={
    journals: JournalReducer,
    user : UsersReducer,
    app: AppReducer,
    router: routerReducer
}