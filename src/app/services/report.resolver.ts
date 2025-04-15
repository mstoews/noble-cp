import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ITrialBalance } from "app/models";
import { IDataSet } from "@syncfusion/ej2-angular-pivotview";
import { ReportService } from "./reports.service";

interface IReportData {
  trialBalance: IDataSet[];
  tb: ITrialBalance[];
}

export const ReportResolver: ResolveFn <IReportData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    var period : { period: number, year: number } = { period: Number(route.queryParamMap.get('period')), year: Number(route.queryParamMap.get('year')) };
    period = period || { period: 1, year: 2025 };
    const reports = inject(ReportService).readPivotDataByPeriod(period);
    return reports as any as Observable<IReportData>;    
};
