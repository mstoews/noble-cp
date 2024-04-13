import {
        IDistributionLedger,
        IDistributionLedgerReport,
        IDistributionReport,
        IJournalDetail,
        ITransaction
} from '../models';
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class DistributionLedgerService {
    hashDistributionLedger = new Map<string, IDistributionLedger>();
    hashDistributionReport = new Map<number, IDistributionReport>();

    rootUrl = environment.baseUrl;
    private bLoading = false;

    http = inject(HttpClient);

    constructor() {
        this.hashDistributionLedger.clear();
        this.hashDistributionReport.clear();
        this.createDistributionReportMap(1,2024);
    }

    createDistributionReportMap(prd: number, prdYear: number) {
        const report$ = this.getDistributionReportByPrdAndYear(prd, prdYear);
        report$.subscribe( report => {
                report.forEach(data => this.hashDistributionReport.set(data.child, data))
        });
    }

    getDistributionReportByPrdAndYear(period: number , periodYear: number) {
        const params = {
            "period": period,
            "period_year": periodYear
        }
        return this.http.post<IDistributionReport[]>(`${this.rootUrl}/v1/dist_list_by_prd`, params)
        .pipe(shareReplay());
    }

    writeDistributionReportFromHash()
    {
        this.hashDistributionReport.forEach(report => {
            console.debug(JSON.stringify(report));
        });
    }


    getDistributionByPrdAndYear(period: number , periodYear: number) {
        const params = {
            "period": period,
            "period_year": periodYear
        }
        return this.http.post<IDistributionLedgerReport>(`${this.rootUrl}/v1/dist_list_by_prd`, params)
        .pipe(shareReplay());
    }


    getTransactionsList(period: number, periodYear: number){
            const params = {
                "period": period,
                "period_year": periodYear
            }
            return this.http.post(`${this.rootUrl}/v1/dist_list_by_prd`, params)
            .pipe(shareReplay());
    }


    hashJournalMap = new Map<string, ITransaction[]>();
    hashJournalDetailsMap = new Map<string, IJournalDetail[]>();

    //Query
    async updateJournalHash() {
        this.getDistributionByPrdAndYear(1, 2024)
    }

    getLoading() {
        return this.bLoading;
    }

    public getDistributionElementByKey(key: string): IDistributionLedger {
        //console.log(key);
        const element = this.hashDistributionLedger.get(key)
        // console.log('closing balance', element.closing_balance);
        return element;
    }

    // loadDist(period: string) {
    //     this.getDistributionByPeriod(period).subscribe((dist) => {
    //         dist.forEach((item) => {
    //             this.hashDistributionLedger.set(item.account + item.child + item.period + item.period_year, item);
    //         });
    //         this.bLoading = false;
    //     });
    // }

    // getDistributionByPeriod(period: string) {
    //     // return this.http.get<GLDistributionLedger[]>(`${environment.baseUrl}/dist_by_prd/${period}`);
    //     return this.http.get<GLDistributionLedger[]>(`${environment.baseUrl}/dist`);
    // }

    getDistributionList() {
        return this.http.get<IDistributionLedger[]>(`${environment.baseUrl}/dist`);
    }

}
