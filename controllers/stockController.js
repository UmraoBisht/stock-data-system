// controllers/stockController.js
import Stock from "../models/stock.js";
import parseDateRange from "../utils/parseDateRange.js";
import csv from "csv-parser";
import { Readable } from "stream";

const uploadStockData = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const requiredColumns = [
    "Date",
    "Symbol",
    "Series",
    "Prev Close",
    "Open",
    "High",
    "Low",
    "Last",
    "Close",
    "VWAP",
    "Volume",
    "Turnover",
    "Trades",
    "Deliverable Volume",
    "%Deliverble",
  ];

  let totalRecords = 0;
  let successfulRecords = 0;
  let failedRecords = 0;
  let errors = [];
  const stockDataArray = [];
  let responseSent = false; // Flag to track if response has been sent

  // Create a readable stream from the buffer
  const readableStream = Readable.from(req.file.buffer);

  readableStream
    .pipe(csv())
    .on("headers", (headers) => {
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );
      if (missingColumns.length > 0) {
        if (!responseSent) {
          responseSent = true; // Set the flag
          return res
            .status(400)
            .json({ message: `Missing columns: ${missingColumns.join(", ")}` });
        }
      }
    })
    .on("data", (row) => {
      totalRecords += 1;

      if (validateRow(row)) {
        stockDataArray.push({
          date: new Date(row.Date).toLocaleDateString(),
          symbol: row.Symbol,
          series: row.Series,
          prev_close: parseFloat(row["Prev Close"]),
          open: parseFloat(row.Open),
          high: parseFloat(row.High),
          low: parseFloat(row.Low),
          last: parseFloat(row.Last),
          close: parseFloat(row.Close),
          vwap: parseFloat(row.VWAP),
          volume: parseInt(row.Volume, 10),
          turnover: parseFloat(row.Turnover),
          trades: parseInt(row.Trades, 10),
          deliverable: parseInt(row["Deliverable Volume"], 10),
          percent_deliverable: parseFloat(row["%Deliverble"]),
        });
        successfulRecords += 1;
      } else {
        failedRecords += 1;
        errors.push({ row, reason: "Validation error" });
      }
    })
    .on("end", async () => {
      if (responseSent) return; // Prevent sending a response if already sent

      try {
        if (stockDataArray.length > 0) {
          await Stock.insertMany(stockDataArray);
        }
        res.json({
          totalRecords,
          successfulRecords,
          failedRecords,
          errors,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error inserting data into MongoDB",
          error: error,
        });
      }
    });
};

// Helper function for row validation
const validateRow = (row) => {
  // Validate Date
  const isDateValid = !isNaN(Date.parse(row.Date));

  // Validate Numeric Fields
  const isNumericFieldsValid = [
    "Prev Close",
    "Open",
    "High",
    "Low",
    "Last",
    "Close",
    "VWAP",
    "Volume",
    "Turnover",
    "Trades",
    "Deliverable Volume", // Use exact header from CSV
    "%Deliverble", // Use exact header from CSV
  ].every(
    (field) =>
      row[field] !== undefined &&
      row[field] !== "" &&
      !isNaN(parseFloat(row[field]))
  );

  return isDateValid && isNumericFieldsValid;
};

// API 1: Get the record with the highest volume
const getHighestVolume = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;

  const query = parseDateRange(start_date, end_date);
  if (symbol) query.symbol = symbol;

  try {
    const highestVolume = await Stock.find(query)
      .sort({ volume: -1 })
      .limit(1)
      .select("date symbol volume")
      .lean();

    if (highestVolume.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.json({ highest_volume: highestVolume[0] });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving highest volume",
      error: error.message,
    });
  }
};

// API 2: Calculate average closing price
const getAverageClose = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;

  if (!symbol) {
    return res
      .status(400)
      .json({ message: "Symbol is required for average_close calculation" });
  }

  const query = parseDateRange(start_date, end_date);
  query.symbol = symbol;

  try {
    const averageCloseData = await Stock.aggregate([
      { $match: query },
      { $group: { _id: null, average_close: { $avg: "$close" } } },
    ]);

    if (averageCloseData.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for specified criteria" });
    }

    res.json({ average_close: averageCloseData[0].average_close });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating average close",
      error: error.message,
    });
  }
};

// API 3: Calculate average VWAP
const getAverageVWAP = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;

  const query = parseDateRange(start_date, end_date);
  if (symbol) query.symbol = symbol;

  try {
    const averageVWAPData = await Stock.aggregate([
      { $match: query },
      { $group: { _id: null, average_vwap: { $avg: "$vwap" } } },
    ]);

    if (averageVWAPData.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for specified criteria" });
    }

    res.json({ average_vwap: averageVWAPData[0].average_vwap });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating average VWAP",
      error: error.message,
    });
  }
};

export { uploadStockData, getAverageClose, getAverageVWAP, getHighestVolume,validateRow };
