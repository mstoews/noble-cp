
import { FuseAlertComponent } from '../alert.component';




// Mock interfaces and classes
interface MockSimpleChanges {
    [key: string]: {
        currentValue: any;
        previousValue: any;
        firstChange: boolean;
        isFirstChange: () => boolean;
    };
}

interface MockEventEmitter {
    next: jest.Mock;
}


class MockChangeDetectorRef {
    markForCheck = jest.fn();
}

class MockFuseAlertService { }

class MockFuseUtilsService {
    randomId = jest.fn().mockReturnValue('random-id');
}

describe('FuseAlertComponent.ngOnChanges() ngOnChanges method', () => {
    let component: FuseAlertComponent;
    let mockChangeDetectorRef: MockChangeDetectorRef;
    let mockFuseAlertService: MockFuseAlertService;
    let mockFuseUtilsService: MockFuseUtilsService;
    let mockDismissedChanged: MockEventEmitter;

    beforeEach(() => {
        mockChangeDetectorRef = new MockChangeDetectorRef() as any;
        mockFuseAlertService = new MockFuseAlertService() as any;
        mockFuseUtilsService = new MockFuseUtilsService() as any;
        mockDismissedChanged = { next: jest.fn() } as any;

        component = new FuseAlertComponent(
            mockChangeDetectorRef as any,
            mockFuseAlertService as any,
            mockFuseUtilsService as any
        );

        (component as any).dismissedChanged = mockDismissedChanged;
    });

    describe('Happy paths', () => {
        it('should coerce dismissed to boolean and toggle dismiss', () => {
            const changes: MockSimpleChanges = {
                dismissed: {
                    currentValue: 'true',
                    previousValue: false,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            };

            component.ngOnChanges(changes as any);

            expect(component.dismissed).toBe(true);
            expect(mockDismissedChanged.next).toHaveBeenCalledWith(true);
            expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
        });

        it('should coerce dismissible to boolean', () => {
            const changes: MockSimpleChanges = {
                dismissible: {
                    currentValue: 'true',
                    previousValue: false,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            };

            component.ngOnChanges(changes as any);

            expect(component.dismissible).toBe(true);
        });

        it('should coerce showIcon to boolean', () => {
            const changes: MockSimpleChanges = {
                showIcon: {
                    currentValue: 'false',
                    previousValue: true,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            };

            component.ngOnChanges(changes as any);

            expect(component.showIcon).toBe(false);
        });
    });

    describe('Edge cases', () => {
        it('should handle undefined dismissed change', () => {
            const changes: MockSimpleChanges = {
                dismissed: {
                    currentValue: undefined,
                    previousValue: true,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            };

            component.ngOnChanges(changes as any);

            expect(component.dismissed).toBe(false);
            expect(mockDismissedChanged.next).toHaveBeenCalledWith(false);
            expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
        });

        it('should handle undefined dismissible change', () => {
            const changes: MockSimpleChanges = {
                dismissible: {
                    currentValue: undefined,
                    previousValue: true,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            };

            component.ngOnChanges(changes as any);

            expect(component.dismissible).toBe(false);
        });

        it('should handle undefined showIcon change', () => {
            const changes: MockSimpleChanges = {
                showIcon: {
                    currentValue: undefined,
                    previousValue: true,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            };

            component.ngOnChanges(changes as any);

            expect(component.showIcon).toBe(false);
        });
    });
});