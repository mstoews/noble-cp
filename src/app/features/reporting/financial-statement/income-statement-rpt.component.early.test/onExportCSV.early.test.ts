
import html2PDF from 'jspdf-html2canvas';
import { IncomeStatementRptComponent } from '../income-statement-rpt.component';


// Mock classes and interfaces





class MockjsPDF {
    save = jest.fn();
}

// Mock the html2PDF function
jest.mock("jspdf-html2canvas", () => jest.fn());

// Test suite for onExportCSV method
describe('IncomeStatementRptComponent.onExportCSV() onExportCSV method', () => {
    let component: IncomeStatementRptComponent;
    let mockDistributionLedgerService: any;
    let mockHtml2PDF: jest.MockedFunction<typeof html2PDF>;

    beforeEach(() => {
        // Initialize mocks
        mockDistributionLedgerService = {
            getDistributionByPrdAndYear: jest.fn().mockReturnValue({
                pipe: jest.fn().mockReturnValue({
                    subscribe: jest.fn(),
                }),
            }),
        };

        mockHtml2PDF = jest.mocked(html2PDF);

        // Initialize component with mocks
        component = new IncomeStatementRptComponent(mockDistributionLedgerService as any);
    });

    describe('Happy paths', () => {
        it('should call html2PDF with correct parameters', () => {
            // Arrange
            document.body.innerHTML = '<div id="income-statement"></div>';
            const mockElement = document.getElementById('income-statement');

            // Act
            component.onExportCSV();

            // Assert
            expect(mockHtml2PDF).toHaveBeenCalledWith(mockElement, expect.objectContaining({
                jsPDF: expect.any(Object),
                html2canvas: expect.any(Object),
                imageType: 'image/jpeg',
                imageQuality: 1,
                margin: expect.any(Object),
                success: expect.any(Function),
            }));
        });

        it('should save PDF with correct filename', () => {
            // Arrange
            const mockSave = jest.fn();
            mockHtml2PDF.mockImplementation((element, options) => {
                options.success(new MockjsPDF() as any);
            });

            // Act
            component.onExportCSV();

            // Assert
            expect(mockSave).toHaveBeenCalledWith(expect.stringContaining('IncomeStatementDetails'));
        });
    });

    describe('Edge cases', () => {
        it('should handle missing income-statement element gracefully', () => {
            // Arrange
            document.body.innerHTML = '';

            // Act
            component.onExportCSV();

            // Assert
            expect(mockHtml2PDF).not.toHaveBeenCalled();
        });

        it('should handle html2PDF failure gracefully', () => {
            // Arrange
            document.body.innerHTML = '<div id="income-statement"></div>';
            mockHtml2PDF.mockImplementation(() => {
                throw new Error('html2PDF failed');
            });

            // Act & Assert
            expect(() => component.onExportCSV()).not.toThrow();
        });
    });
});