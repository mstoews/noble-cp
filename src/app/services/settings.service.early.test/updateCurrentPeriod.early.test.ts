
import { IPeriodParam } from 'app/models/period';
import { environment } from 'environments/environment.prod';
import { SettingsService } from '../settings.service';


import { of, throwError } from 'rxjs';





class MockHttpClient {
    post = jest.fn();
}

describe('SettingsService.updateCurrentPeriod() updateCurrentPeriod method', () => {
    let service: SettingsService;
    let mockHttpClient: MockHttpClient;

    beforeEach(() => {
        mockHttpClient = new MockHttpClient();
        service = new SettingsService() as any;
        service.httpClient = mockHttpClient as any;
    });

    describe('Happy paths', () => {
        it('should successfully post the period parameter and return the response', (done) => {
            const periodParam: IPeriodParam = { period: 1, period_year: 2023 };
            const expectedResponse = { success: true };

            mockHttpClient.post.mockReturnValue(of(expectedResponse) as any);

            service.updateCurrentPeriod(periodParam).subscribe(response => {
                expect(response).toEqual(expectedResponse);
                expect(mockHttpClient.post).toHaveBeenCalledWith(
                    `${environment.baseUrl}/v1/update_current_period`,
                    periodParam
                );
                done();
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle an error response gracefully', (done) => {
            const periodParam: IPeriodParam = { period: 1, period_year: 2023 };
            const errorResponse = { error: 'Network error' };

            mockHttpClient.post.mockReturnValue(throwError(() => errorResponse) as any);

            service.updateCurrentPeriod(periodParam).subscribe({
                next: () => {
                    // This block should not be executed
                },
                error: (error) => {
                    expect(error).toEqual(errorResponse);
                    expect(mockHttpClient.post).toHaveBeenCalledWith(
                        `${environment.baseUrl}/v1/update_current_period`,
                        periodParam
                    );
                    done();
                }
            });
        });

        it('should handle an empty period parameter', (done) => {
            const periodParam: IPeriodParam = { period: 0, period_year: 0 };
            const expectedResponse = { success: true };

            mockHttpClient.post.mockReturnValue(of(expectedResponse) as any);

            service.updateCurrentPeriod(periodParam).subscribe(response => {
                expect(response).toEqual(expectedResponse);
                expect(mockHttpClient.post).toHaveBeenCalledWith(
                    `${environment.baseUrl}/v1/update_current_period`,
                    periodParam
                );
                done();
            });
        });
    });
});