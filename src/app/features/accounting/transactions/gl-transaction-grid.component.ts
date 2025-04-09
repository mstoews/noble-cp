import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService, GridModule, SortService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
    selector: 'gl-grid-transactions',
    imports: [CommonModule, GridModule, ButtonModule],
    providers: [FilterService, SortService],
    template: `
        <section class="bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <div class="mx-auto w-full py-12 sm:px-6 px-2">
                <ejs-grid #grid [dataSource]="data" width="100%" height="668" [allowSorting]="true" [allowFiltering]="true" [filterSettings]="{type:'Bar'}" role="grid" class="overflow-hidden">
                    <e-columns>
                        <e-column type="checkbox" isPrimaryKey="true" textAlign="Center" width="40"></e-column>
                        <e-column field="transactionId" headerText="Transaction ID" width="143"></e-column>
                        <e-column field="customerDetails" headerText="Customer Name" textAlign="Left" width="270">
                            <ng-template #template let-data>
                                <div class="flex gap-3 items-center py-1.5">
                                    <div class="w-8 h-8">
                                        <span class="e-avatar e-avatar-circle e-avatar-small" [ngStyle]="{ 'background-image': 'url(assets/images/common/avatar/' + data.customerDetails.avatar + ')' }"></span>
                                    </div>
                                    <div class="flex flex-col text-sm">
                                        <p class="text-gray-900 dark:text-gray-50">{{data.customerDetails.name}}</p>
                                        <p class="text-gray-500 dark:text-gray-400">{{data.customerDetails.email}}</p>
                                    </div>
                                </div>
                            </ng-template>
                        </e-column>
                        <e-column field="invoiceNumber" headerText="Invoice Number" width="150">
                            <ng-template #template let-data>
                                <a class="text-primary-700 dark:text-primary-500 font-medium" href="javascript:void(0);" aria-label="invoice number" role="link">{{data.invoiceNumber}}</a>
                            </ng-template>
                        </e-column>
                        <e-column field="description" headerText="Description" width="214"></e-column>
                        <e-column field="amount" headerText="Total Amount" width="140" format="c2" textAlign="Right"></e-column>
                        <e-column field="date" headerText="Transaction Date" width="140" [format]="{type: 'date', format: 'MM/dd/yyyy'}" textAlign="Right"></e-column>
                        <e-column field="paymentMethod" headerText="Payment Method" width="155"></e-column>
                        <e-column field="status" headerText="Status" width="122">
                            <ng-template #template let-data>                                                                
                                @switch (data.status) 
                                {                                    
                                    @case ('Completed') {                                        
                                        <span class="e-badge flex text-md gap-1 items-center w-max bg-transparent">
                                            <div class="w-4 h-4  rounded-full bg-green-700"></div>
                                            Completed 
                                        </span>
                                    }
                                    @case ('Pending') {
                                      <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                        <div class="w-4 h-4 rounded-full bg-orange-700"></div>
                                        Pending
                                      </span>
                                    }                                    
                                    @case ('Cleared') {
                                        <span class="e-badge flex text-md  gap-1 items-center w-max bg-transparent">
                                            <div class="w-4 h-4 rounded-full bg-cyan-700"></div>
                                            Cleared
                                        </span>
                                    }
                                    @case ('Failed') {
                                        <span class="e-badge flex  text-md  gap-1 items-center w-max bg-transparent">
                                            <div class="w-4 h-4 rounded-full bg-red-700"></div>
                                            Failed
                                        </span>
                                    }
                                }
                            </ng-template>
                        </e-column>
                    </e-columns>
                </ejs-grid>
            </div>
        </section>
    `
})
export class GLTransactionGridComponent implements OnInit, OnDestroy {
    /* SB Code - Start */
    public currentTheme: string = 'tailwind';
    /* SB Code - End */

    constructor() { }

    public ngOnInit(): void {
        /* SB Code - Start */
        window.addEventListener('message', this.handleMessageEvent);
        /* SB Code - End */
    }

    public ngOnDestroy(): void {
        /* SB Code - Start */
        window.removeEventListener('message', this.handleMessageEvent);
        /* SB Code - End */
    }

    public data: Object[] = [
        {
            id: 1,
            transactionId: "TRX202401",
            customerDetails: {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                avatar: "avatar-8.jpg"
            },
            invoiceNumber: "INV202401",
            description: "Payment for invoice",
            amount: 1300,
            date: new Date("2024-05-17"),
            paymentMethod: "Credit Card",
            status: "Completed"
        },
        {
            id: 2,
            transactionId: "TRX202402",
            customerDetails: {
                name: "Mark Johnson",
                email: "mark.johnson@example.com",
                avatar: "avatar-1.jpg"
            },
            invoiceNumber: "INV202402",
            description: "Subscription renewal",
            amount: 450,
            date: new Date("2024-11-12"),
            paymentMethod: "PayPal",
            status: "Pending"
        },
        {
            id: 3,
            transactionId: "TRX202403",
            customerDetails: {
                name: "Emily White",
                email: "emily.white@example.com",
                avatar: "avatar-9.jpg"
            },
            invoiceNumber: "INV202403",
            description: "Consulting services",
            amount: 2800,
            date: new Date("2024-01-15"),
            paymentMethod: "Online Transfer",
            status: "Failed"
        },
        {
            id: 4,
            transactionId: "TRX202404",
            customerDetails: {
                name: "Tom Harris",
                email: "tom.harris@example.com",
                avatar: "avatar-4.jpg"
            },
            invoiceNumber: "INV202404",
            description: "Equipment purchase",
            amount: 2750,
            date: new Date("2024-07-18"),
            paymentMethod: "Online Transfer",
            status: "Completed"
        },
        {
            id: 5,
            transactionId: "TRX202405",
            customerDetails: {
                name: "Lisa Green",
                email: "lisa.green@example.com",
                avatar: "avatar-10.jpg"
            },
            invoiceNumber: "INV202405",
            description: "Event sponsorship",
            amount: 3870,
            date: new Date("2024-01-23"),
            paymentMethod: "PayPal",
            status: "Cleared"
        },
        {
            id: 6,
            transactionId: "TRX202406",
            customerDetails: {
                name: "David Clark",
                email: "david.clark@example.com",
                avatar: "avatar-5.jpg"
            },
            invoiceNumber: "INV202406",
            description: "Online course registration",
            amount: 580,
            date: new Date("2024-03-12"),
            paymentMethod: "Cheque",
            status: "Failed"
        },
        {
            id: 7,
            transactionId: "TRX202407",
            customerDetails: {
                name: "Rachel Lee",
                email: "rachel.lee@example.com",
                avatar: "avatar-6.jpg"
            },
            invoiceNumber: "INV202407",
            description: "Software license renewal",
            amount: 1250,
            date: new Date("2024-09-08"),
            paymentMethod: "Credit Card",
            status: "Completed"
        },
        {
            id: 8,
            transactionId: "TRX202408",
            customerDetails: {
                name: "Olivia Adams",
                email: "olivia.adams@example.com",
                avatar: "avatar-10.jpg"
            },
            invoiceNumber: "INV202408",
            description: "Consulting services",
            amount: 648,
            date: new Date("2024-10-12"),
            paymentMethod: "PayPal",
            status: "Failed"
        },
        {
            id: 9,
            transactionId: "TRX202409",
            customerDetails: {
                name: "Lucas Brown",
                email: "lucas.brown@example.com",
                avatar: "avatar-11.jpg"
            },
            invoiceNumber: "INV202409",
            description: "Membership fee",
            amount: 792,
            date: new Date("2024-06-11"),
            paymentMethod: "Cheque",
            status: "Pending"
        },
        {
            id: 10,
            transactionId: "TRX202410",
            customerDetails: {
                name: "Sophia Martinez",
                email: "sophia.martinez@example.com",
                avatar: "avatar-14.jpg"
            },
            invoiceNumber: "INV202410",
            description: "Training workshop fee",
            amount: 840,
            date: new Date("2024-02-17"),
            paymentMethod: "Cheque",
            status: "Completed"
        }
    ];

    /* SB Code - Start */
    private handleMessageEvent = (event: MessageEvent): void => {
        if (event.origin === window.location.origin) {
            try {
                const blockData = JSON.parse(event.data);
                if (blockData.name === 'grid-6' && blockData.theme) {
                    this.currentTheme = blockData.theme;
                }
            } catch (error) {
                console.error('Error parsing message data: ', error);
            }
        }
    };
    /* SB Code - End */
}
