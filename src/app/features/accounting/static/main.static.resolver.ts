import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { combineLatestWith, Observable } from "rxjs";
import { IGLType } from "app/models/types";
import { TypeService } from "app/services/type.service";
import { Store } from "@ngrx/store";




interface IJournalData {  
  journalTypes: IGLType[];  
}
export const MainStaticResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    const store = inject(Store);
        
    return inject(TypeService).read().pipe(combineLatestWith([       
      
          
     ]
  )) as any as Observable<IJournalData>;    
};


