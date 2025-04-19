
import { FormBuilder } from '@angular/forms';
import { JournalEntryComponent } from '../journal-listing.component';


// Mock classes and interfaces
class MockFormGroup {
    patchValue = jest.fn();
}


class MockRouter {
    navigate = jest.fn();
}

class MockStore {
    select = jest.fn();
}

class MockToastrService {
    success = jest.fn();
    error = jest.fn();
}

class MockJournalStore { }

class MockSettingsService { }

describe('JournalEntryComponent.openDrawer() openDrawer method', () => {
    let component: JournalEntryComponent;
    let mockFormBuilder: FormBuilder;
    let mockRouter: MockRouter;
    let mockStore: MockStore;
    let mockToastrService: MockToastrService;
    let mockJournalStore: MockJournalStore;
    let mockSettingsService: MockSettingsService;
    let mockFormGroup: MockFormGroup;

    beforeEach(() => {
        mockFormBuilder = new FormBuilder();
        mockRouter = new MockRouter() as any;
        mockStore = new MockStore() as any;
        mockToastrService = new MockToastrService() as any;
        mockJournalStore = new MockJournalStore() as any;
        mockSettingsService = new MockSettingsService() as any;
        mockFormGroup = new MockFormGroup() as any;

        component = new JournalEntryComponent(
            mockRouter as any,
            mockStore as any,
            mockToastrService as any,
            mockJournalStore as any,
            mockSettingsService as any,
            mockFormBuilder as any
        );

        component.periodForm = mockFormGroup as any;
        component.periodParam = { period: 1, period_year: 2025 };
    });

    it('should patch the form with period and period_year', () => {
        component.openDrawer();
        expect(mockFormGroup.patchValue).toHaveBeenCalledWith({
            period: 1,
            period_year: 2025,
        });
    });

    it('should handle edge case where periodParam is undefined', () => {
        component.periodParam = undefined as any;
        component.openDrawer();
        expect(mockFormGroup.patchValue).toHaveBeenCalledWith({
            period: undefined,
            period_year: undefined,
        });
    });

    it('should handle edge case where periodForm is undefined', () => {
        component.periodForm = undefined as any;
        expect(() => component.openDrawer()).not.toThrow();
    });
});