
import { FormGroup } from '@angular/forms';
import { DropDownAccountComponent } from '../drop-down-account.component';

// Mock ControlContainer
class MockControlContainer {
    control: FormGroup = new FormGroup({});
}

describe('DropDownAccountComponent.ngOnInit() ngOnInit method', () => {
    let component: DropDownAccountComponent;
    let mockControlContainer: MockControlContainer;

    beforeEach(() => {
        mockControlContainer = new MockControlContainer();
        component = new DropDownAccountComponent();
    });

    describe('Happy paths', () => {
        it('should add a control to the parent form group with the specified controlKey', () => {
            // Arrange
            component.controlKey = 'testControlKey';

            // Act
            component.ngOnInit();

            // Assert
            expect(mockControlContainer.control.contains('testControlKey')).toBe(true);
        });

        it('should initialize the dropdownCtrl with a new FormControl', () => {
            // Arrange
            component.controlKey = 'testControlKey';

            // Act
            component.ngOnInit();

            // Assert
            const formGroup = mockControlContainer.control.get('testControlKey') as FormGroup;
            expect(formGroup.contains('dropdownCtrl')).toBe(true);
        });
    });

    describe('Edge cases', () => {
        it('should handle an empty controlKey gracefully', () => {
            // Arrange
            component.controlKey = '';

            // Act
            component.ngOnInit();

            // Assert
            expect(mockControlContainer.control.contains('')).toBe(false);
        });

        it('should not throw an error if controlKey is not provided', () => {
            // Arrange
            component.controlKey = undefined as any;

            // Act & Assert
            expect(() => component.ngOnInit()).not.toThrow();
        });
    });
});