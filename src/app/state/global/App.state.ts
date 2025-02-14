
import { UsersReducer } from "../users/Users.Reducer";
import { AppReducer } from "./App.Reducer";
import { routerReducer} from '@ngrx/router-store'

export const AppState={    
    user : UsersReducer,
    app: AppReducer,
    router: routerReducer
}