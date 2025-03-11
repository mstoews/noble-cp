import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ChatComponent } from './chat.component';


export default [
    {
        path     : '',
        component: ChatComponent,        
    },
] as Routes;
