import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SalesGraphComponent } from '../admin/sales-graph/sales-graph.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// import { AuthService } from 'app/modules/auth/auth.service';


const imports = [
    CommonModule,
    MatButtonModule,
    MatIconModule
];

@Component({
    selector: 'app-analysis',
    imports: [imports],
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
    authService = inject(AuthService);
    private router = inject(Router);
    constructor() {
        effect(() => {
            if (!this.authService.user()) {
                this.router.navigate(['auth/login']);
            }
        });
    }
}
