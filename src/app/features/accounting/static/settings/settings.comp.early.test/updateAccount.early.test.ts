
import { ISettings } from "app/models";
import { AppSettingsComponent } from '../settings.comp';


// src/app/features/accounting/static/settings/settings.comp.spec.ts
// Mock for MatDrawer



// Mock for SettingsStore
class MockSettingsStore {
    public updateSetting = jest.fn();
}

describe('AppSettingsComponent.updateAccount() updateAccount method', () => {
    let component: AppSettingsComponent;
    let mockStore: MockSettingsStore;

    beforeEach(() => {
        // Create a new mock store for each test
        mockStore = new MockSettingsStore();
        // Create the component, injecting the mock store and other dependencies as any
        component = new AppSettingsComponent();
        // Override the store with our mock
        component.store = mockStore as any;
    });

    // ------------------- Happy Path Tests -------------------
    describe('Happy Paths', () => {
        it('should call store.updateSetting with a valid ISettings object', () => {
            // This test ensures that updateAccount calls updateSetting with the correct argument
            const validSetting: ISettings = {
                id: 1,
                setting: 'currency',
                value: 'USD',
                description: 'Default currency',
                create_date: '2024-01-01',
                create_user: 'admin',
                update_date: '2024-06-01',
                update_user: 'admin'
            };

            component.updateAccount(validSetting as any);

            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledTimes(1);
            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledWith(validSetting as any);
        });

        it('should allow updating with different valid settings (robustness)', () => {
            // This test ensures that updateAccount works with different valid settings
            const anotherSetting: ISettings = {
                id: 2,
                setting: 'timezone',
                value: 'UTC',
                description: 'System timezone',
                create_date: '2024-02-01',
                create_user: 'user1',
                update_date: '2024-06-02',
                update_user: 'user2'
            };

            component.updateAccount(anotherSetting as any);

            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledWith(anotherSetting as any);
        });

        it('should pass the exact object reference to store.updateSetting', () => {
            // This test ensures that the same object reference is passed through
            const settingObj: ISettings = {
                id: 3,
                setting: 'language',
                value: 'en',
                description: 'Default language',
                create_date: '2024-03-01',
                create_user: 'user3',
                update_date: '2024-06-03',
                update_user: 'user3'
            };

            component.updateAccount(settingObj as any);

            expect(jest.mocked(mockStore.updateSetting).mock.calls[0][0]).toBe(settingObj as any);
        });
    });

    // ------------------- Edge Case Tests -------------------
    describe('Edge Cases', () => {
        it('should handle ISettings with empty strings for all fields', () => {
            // This test checks that empty string fields are accepted and passed through
            const emptySetting: ISettings = {
                id: 0,
                setting: '',
                value: '',
                description: '',
                create_date: '',
                create_user: '',
                update_date: '',
                update_user: ''
            };

            component.updateAccount(emptySetting as any);

            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledWith(emptySetting as any);
        });

        it('should handle ISettings with very large id and long strings', () => {
            // This test checks for large numbers and long strings
            const largeSetting: ISettings = {
                id: Number.MAX_SAFE_INTEGER,
                setting: 'x'.repeat(1000),
                value: 'y'.repeat(1000),
                description: 'z'.repeat(1000),
                create_date: '2099-12-31',
                create_user: 'user'.repeat(100),
                update_date: '2099-12-31',
                update_user: 'admin'.repeat(100)
            };

            component.updateAccount(largeSetting as any);

            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledWith(largeSetting as any);
        });

        it('should handle ISettings with special characters in fields', () => {
            // This test checks for special characters in string fields
            const specialSetting: ISettings = {
                id: 42,
                setting: '!@#$%^&*()_+',
                value: '<script>alert("x")</script>',
                description: 'Description with emoji 🚀🔥',
                create_date: '2024-06-01T12:34:56Z',
                create_user: 'user!@#',
                update_date: '2024-06-01T12:34:56Z',
                update_user: 'admin$%^'
            };

            component.updateAccount(specialSetting as any);

            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledWith(specialSetting as any);
        });

        it('should handle ISettings with id = 0', () => {
            // This test checks that id=0 is accepted
            const zeroIdSetting: ISettings = {
                id: 0,
                setting: 'zero',
                value: '0',
                description: 'id is zero',
                create_date: '2024-06-01',
                create_user: 'zero',
                update_date: '2024-06-01',
                update_user: 'zero'
            };

            component.updateAccount(zeroIdSetting as any);

            expect(jest.mocked(mockStore.updateSetting)).toHaveBeenCalledWith(zeroIdSetting as any);
        });
    });
});