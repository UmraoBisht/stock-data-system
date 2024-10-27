// models/Stock.js
import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  date: { type: Date, required: true },
  series: String,
  prev_close: Number,
  open: Number,
  high: Number,
  low: Number,
  last: Number,
  close: Number,
  vwap: Number,
  volume: Number,
  turnover: Number,
  trades: Number,
  deliverable: Number,
  percent_deliverable: Number,
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
