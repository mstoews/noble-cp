import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { Faq, FaqCategory, Guide, GuideCategory } from 'app/features/help-center/help-center.type';
import { environment } from 'environments/environment';
import { Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HelpCenterService {
    private _faqs: ReplaySubject<FaqCategory[]> = new ReplaySubject<FaqCategory[]>(1);
    private _guides: ReplaySubject<GuideCategory[]> = new ReplaySubject<GuideCategory[]>(1);
    private _guide: ReplaySubject<Guide> = new ReplaySubject<Guide>(1);
    private _httpClient = inject(HttpClient);
    isLoading: boolean;
    public baseUrl = environment.baseUrl;

    get faqs$(): Observable<FaqCategory[]> {
        return this._faqs.asObservable();
    }

    get guides$(): Observable<GuideCategory[]> {
        return this._guides.asObservable();
    }

    get guide$(): Observable<GuideCategory> {
        return this._guide.asObservable();
    }

    getAllFaqs(): Observable<Faq[]> {

        var faqUrl = this.baseUrl + '/v1/read_faq';
        return this._httpClient.get<Faq[]>(faqUrl).pipe(
            tap((response: any) => {
                this._faqs.next(response);
            }),
        );
    }

    getFaqsByCategory(slug: string): Observable<FaqCategory[]> {

        var faqUrl = this.baseUrl + '/v1/read_faq_categories';
        return this._httpClient.get<FaqCategory[]>(faqUrl).pipe(
            tap((response: any) => {
                this._faqs.next(response);
            }),
        );
    }

    getAllGuides(limit = '4'): Observable<GuideCategory[]> {
        var url = this.baseUrl + '/v1/read_guide_categories';
        return this._httpClient.get<GuideCategory[]>(url).pipe(
            tap((response: any) => {
                this._guides.next(response);
            }),
        );
    }

    getGuidesByCategory(slug: string): Observable<GuideCategory[]> {
        var url = this.baseUrl + '/v1/read_guide_categories';
        return this._httpClient.get<GuideCategory[]>(url, {
            params: { slug },
        }).pipe(
            tap((response: any) => {
                this._guides.next(response);
            }),
        );
    }

    getGuide(categorySlug: string, guideSlug: string): Observable<GuideCategory> {
        var url = this.baseUrl + '/v1/read_guide_categories';
        return this._httpClient.get<GuideCategory>(url, {
            params: {
                categorySlug,
                guideSlug,
            },
        }).pipe(
            tap((response: any) => {
                this._guide.next(response);
            }),
        );
    }
}
