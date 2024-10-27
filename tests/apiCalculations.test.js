// tests/apiCalculations.test.js
import request from 'supertest';
import app from '../app'; // Adjust the path to your Express app

describe('Stock Data API Calculations', () => {
  it('should return the highest volume for a given date range', async () => {
    const response = await request(app)
      .get('/api/highest_volume?start_date=2011-06-1&end_date=2011-06-23')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('highest_volume');
    expect(response.body.highest_volume).toHaveProperty('date');
    expect(response.body.highest_volume).toHaveProperty('symbol');
    expect(response.body.highest_volume).toHaveProperty('volume');
  });

  it('should return the average closing price for a given date range and symbol', async () => {
    const response = await request(app)
      .get('/api/average_close?start_date=2011-06-1&end_date=2011-06-23&symbol=TCS')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('average_close');
    expect(typeof response.body.average_close).toBe('number');
  });

  it('should return the average VWAP for a given date range and symbol', async () => {
    const response = await request(app)
      .get('/api/average_vwap?start_date=2011-01-01&end_date=2011-12-31&symbol=TCS')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('average_vwap');
    expect(typeof response.body.average_vwap).toBe('number');
  });
});
