// tests/validation.test.js
import { validateRow } from '../controllers/stockController.js'; // Adjust the path as needed


describe('validateRow', () => {
  it('should return true for a valid row', () => {
    const validRow = {
      Date: '2024-01-01',
      'Symbol': 'ULTRACEMCO',
      'Series': 'EQ',
      'Prev Close': '10.0',
      'Open': '305.0',
      'High': '340.0',
      'Low': '253.25',
      'Last': '259.0',
      'Close': '260.0',
      'VWAP': '268.8',
      'Volume': '6633956',
      'Turnover': '1.78E14',
      'Trades': '133456',
      'Deliverable Volume': '970249',
      '%Deliverble': '0.1463'
    };

    expect(validateRow(validRow)).toBe(true);
  });

  it('should return false for an invalid row with invalid date', () => {
    const invalidRow = {
      Date: 'invalid-date',
      'Symbol': 'ULTRACEMCO',
      'Series': 'EQ',
      'Prev Close': '10.0',
      'Open': '305.0',
      'High': '340.0',
      'Low': '253.25',
      'Last': '259.0',
      'Close': '260.0',
      'VWAP': '268.8',
      'Volume': '6633956',
      'Turnover': '1.78E14',
      'Trades': '133456',
      'Deliverable Volume': '970249',
      '%Deliverble': '0.1463'
    };

    expect(validateRow(invalidRow)).toBe(false);
  });

  it('should return false for an invalid row with non-numeric fields', () => {
    const invalidRow = {
      Date: '2024-01-01',
      'Symbol': 'ULTRACEMCO',
      'Series': 'EQ',
      'Prev Close': 'invalid',
      'Open': '305.0',
      'High': '340.0',
      'Low': '253.25',
      'Last': '259.0',
      'Close': '260.0',
      'VWAP': '268.8',
      'Volume': '6633956',
      'Turnover': '1.78E14',
      'Trades': '133456',
      'Deliverable Volume': '970249',
      '%Deliverble': '0.1463'
    };

    expect(validateRow(invalidRow)).toBe(false);
  });
});
