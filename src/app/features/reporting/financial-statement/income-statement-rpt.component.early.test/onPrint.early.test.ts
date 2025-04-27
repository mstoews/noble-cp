
import { DistributionLedgerService } from 'app/services/distribution.ledger.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2PDF from 'jspdf-html2canvas';
import { IncomeStatementRptComponent } from '../income-statement-rpt.component';


// Mock classes and interfaces
class MockSubject {
    next = jest.fn();
    complete = jest.fn();
}

class MockjsPDF {
    save = jest.fn();
}

jest.mock("jspdf-html2canvas", () => jest.fn());
jest.mock("html2canvas", () => jest.fn());
jest.mock("jspdf", () => jest.fn().mockImplementation(() => new MockjsPDF() as any));

describe('IncomeStatementRptComponent.onPrint() onPrint method', () => {
    let component: IncomeStatementRptComponent;
    let mockDistributionLedgerService: DistributionLedgerService;
    let mockSubject: MockSubject;

    beforeEach(() => {
        mockDistributionLedgerService = {
            getDistributionByPrdAndYear: jest.fn().mockReturnValue(new MockSubject() as any),
        } as any;

        component = new IncomeStatementRptComponent(mockDistributionLedgerService as any);
        mockSubject = new MockSubject();
    });

    describe('Happy Paths', () => {
        it('should call html2PDF and save the PDF when onPrint is called', async () => {
            // Arrange
            const mockHtml2PDF = jest.mocked(html2PDF);
            const mockHtml2canvas = jest.mocked(html2canvas);
            const mockJsPDF = jest.mocked(jsPDF);

            mockHtml2PDF.mockResolvedValue(undefined as any);
            mockHtml2canvas.mockResolvedValue(undefined as any);

            // Act
            await component.onPrint();

            // Assert
            expect(mockHtml2PDF).toHaveBeenCalled();
            expect(mockHtml2canvas).toHaveBeenCalled();
            expect(mockJsPDF).toHaveBeenCalled();
            expect(mockJsPDF().save).toHaveBeenCalledWith('IncomeStatement.pdf');
        });
    });

    describe('Edge Cases', () => {
        it('should handle errors thrown by html2PDF gracefully', async () => {
            // Arrange
            const mockHtml2PDF = jest.mocked(html2PDF);
            mockHtml2PDF.mockRejectedValue(new Error('html2PDF error') as never);

            // Act & Assert
            await expect(component.onPrint()).rejects.toThrow('html2PDF error');
        });

        it('should handle errors thrown by html2canvas gracefully', async () => {
            // Arrange
            const mockHtml2canvas = jest.mocked(html2canvas);
            mockHtml2canvas.mockRejectedValue(new Error('html2canvas error') as never);

            // Act & Assert
            await expect(component.onPrint()).rejects.toThrow('html2canvas error');
        });
    });
});