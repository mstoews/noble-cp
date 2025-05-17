import { inject } from '@angular/core';
import { NavigationService } from 'app/fuse/core/navigation/navigation.service';
import { forkJoin } from 'rxjs';
import { PeriodStore } from './store/periods.store';

export const initialDataResolver = () =>
{
    
        const navigationService = inject(NavigationService);
        const periodsStore = inject(PeriodStore);
        periodsStore.loadActivePeriods();
        periodsStore.loadCurrentPeriod();                
        periodsStore.loadPeriods();            
        
    
    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        navigationService.get(),
    ]);
};
