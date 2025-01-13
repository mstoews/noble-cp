import {
    IDistributionLedger,
    IDistributionLedgerReport,
    IDistributionParams,
    IJournalParams,
    IJournalSummary,
} from '../models';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DistributionLedgerService {
    http = inject(HttpClient);
    rootUrl = environment.baseUrl;
    private bLoading = false;

    getDistributionReportByPrdAndYear(params: IDistributionParams) {
        return this.http.post<IDistributionLedger[]>(`${this.rootUrl}/v1/dist_list_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getLiabilityTotalByPrdAndYear(params: IDistributionParams) {
        return this.http.post<IDistributionLedger[]>(`${this.rootUrl}/v1/liability_total_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getAssetTotalByPrdAndYear(params: IDistributionParams) {
        return this.http.post<IDistributionLedger[]>(`${this.rootUrl}/v1/asset_total_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getRevenueTotalPrdAndYear(params: IDistributionParams) {
        return this.http.post<IDistributionLedger[]>(`${this.rootUrl}/v1/revenue_total_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getExpenseTotalPrdAndYear(params: IDistributionParams) {
        return this.http.post<IDistributionLedger[]>(`${this.rootUrl}/v1/expense_total_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getDistributionJournalsByChild(params: IJournalParams) {
        return this.http.post<IJournalSummary[]>(`${this.rootUrl}/v1/dist_journals_by_child`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getDistributionJournalsByPeriod(params: IDistributionParams) {
        return this.http.post<IJournalSummary[]>(`${this.rootUrl}/v1/dist_journals_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }


    getDistributionByPrdAndYear(params: IDistributionParams) {
        return this.http.post<IDistributionLedgerReport[]>(`${this.rootUrl}/v1/dist_list_by_prd`, params).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    getLoading() {
        return this.bLoading;
    }

    getDistributionList() {
        return this.http.get<IDistributionLedger[]>(`${environment.baseUrl}/dist`);
    }

}
