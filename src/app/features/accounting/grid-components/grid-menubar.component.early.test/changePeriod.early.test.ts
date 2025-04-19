
import { GridMenubarStandaloneComponent } from '../grid-menubar.component';





interface MockOutputOptions {
    emit: jest.Mock;
}

// Mock implementations
class MockToastrService {
    success = jest.fn();
    error = jest.fn();
}

class MockStore {
    select = jest.fn();
}

describe('GridMenubarStandaloneComponent.changePeriod() changePeriod method', () => {
    let component: GridMenubarStandaloneComponent;
    let mockToastrService: MockToastrService;
    let mockStore: MockStore;
    let mockPeriodOutput: MockOutputOptions;

    beforeEach(() => {
        mockToastrService = new MockToastrService();
        mockStore = new MockStore();
        mockPeriodOutput = { emit: jest.fn() };

        component = new GridMenubarStandaloneComponent(
            mockToastrService as any,
            mockStore as any
        );

        // Override the period output with the mock
        component.period = mockPeriodOutput as any;
    });

    describe('Happy paths', () => {
        it('should emit "change" when changePeriod is called', () => {
            // Act
            component.changePeriod();

            // Assert
            expect(jest.mocked(mockPeriodOutput.emit)).toHaveBeenCalledWith('change');
        });
    });

    describe('Edge cases', () => {
        it('should handle multiple calls to changePeriod gracefully', () => {
            // Act
            component.changePeriod();
            component.changePeriod();
            component.changePeriod();

            // Assert
            expect(jest.mocked(mockPeriodOutput.emit)).toHaveBeenCalledTimes(3);
            expect(jest.mocked(mockPeriodOutput.emit)).toHaveBeenCalledWith('change');
        });

        it('should not throw an error if period output is not defined', () => {
            // Arrange
            component.period = undefined as any;

            // Act & Assert
            expect(() => component.changePeriod()).not.toThrow();
        });
    });
});