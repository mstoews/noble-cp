import { inject } from '@angular/core';
import { NavigationService } from 'app/fuse/core/navigation/navigation.service';
import { MessagesService } from 'app/fuse/layout/common/messages/messages.service';
import { NotificationsService } from 'app/fuse/layout/common/notifications/notifications.service';
import { QuickChatService } from 'app/fuse/layout/common/quick-chat/quick-chat.service';
import { ShortcutsService } from 'app/fuse/layout/common/shortcuts/shortcuts.service';
import { forkJoin } from 'rxjs';
import { PeriodStore } from './store/periods.store';

export const initialDataResolver = () =>
{
    
        const navigationService = inject(NavigationService);
        const periodsStore = inject(PeriodStore);
    
        if (periodsStore.isActiveLoaded() === false) {
            periodsStore.loadActivePeriods();
        }
        if (periodsStore.currentPeriod() === '') {
            periodsStore.loadCurrentPeriod();        
        }
        if (periodsStore.isLoaded() === false) {
             periodsStore.loadPeriods();            
        }
    
    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        navigationService.get(),
    ]);
};
