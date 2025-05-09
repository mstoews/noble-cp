import { } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HelpCenterService } from 'app/features/help-center/help-center.service';
import { FaqCategory } from 'app/features/help-center/help-center.type';
import { FaqService } from 'app/services/faq.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'help-center-faqs',
    templateUrl: './faqs.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule, RouterLink, MatIconModule, MatExpansionModule]
})
export class HelpCenterFaqsComponent implements OnInit, OnDestroy {
    faqCategories: FaqCategory[];
    private _unsubscribeAll: Subject<any> = new Subject();

    faqService = inject(FaqService);

    /**
     * Constructor
     */
    constructor(private _helpCenterService: HelpCenterService) {

        const faq = {
            id: '1',
            title: 'Support',
            slug: 'support'
        }

        this.faqService.createFaq(faq);
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the FAQs
        this._helpCenterService.faqs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((faqCategories) => {
                this.faqCategories = faqCategories;
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
