import { Injectable, ErrorHandler, inject } from '@angular/core'
import { throwError } from 'rxjs';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    router: any;
    
    
    handleError(error: any): void {
        const message = "Could not retrieve journals ...";
          console.debug(message, error.statusText);          
          if (error.statusText === "Unauthorized")
            {
              this.router.navigate(['auth/login']);            
            }
          throwError(() => new Error(`${ JSON.stringify(error.statusText) }`)); 
    }
    
    

}