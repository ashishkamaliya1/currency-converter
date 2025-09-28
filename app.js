// Currency Converter App
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import axios from "axios";

const app = express();

// ✅ Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Sample exchange rates (in a real app, you'd fetch from an API)
const exchangeRates = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    INR: 74.5,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    AED: 3.67,
    PKR: 160.0,
    BDT: 85.0,
    LKR: 200.0,
    NPR: 120.0
};

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Get all available currencies
app.get("/api/currencies", (req, res) => {
    res.json({
        success: true,
        currencies: Object.keys(exchangeRates)
    });
});

// Convert currency
app.post("/api/convert", (req, res) => {
    try {
        const { amount, from, to } = req.body;

        if (!amount || !from || !to) {
            return res.status(400).json({
                success: false,
                message: "Amount, from currency, and to currency are required"
            });
        }

        if (!exchangeRates[from] || !exchangeRates[to]) {
            return res.status(400).json({
                success: false,
                message: "Invalid currency code"
            });
        }

        // Convert to USD first, then to target currency
        const amountInUSD = amount / exchangeRates[from];
        const convertedAmount = amountInUSD * exchangeRates[to];

        res.json({
            success: true,
            originalAmount: parseFloat(amount),
            fromCurrency: from,
            toCurrency: to,
            convertedAmount: parseFloat(convertedAmount.toFixed(2)),
            exchangeRate: parseFloat((exchangeRates[to] / exchangeRates[from]).toFixed(4))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get exchange rate between two currencies
app.get("/api/rate/:from/:to", (req, res) => {
    try {
        const { from, to } = req.params;

        if (!exchangeRates[from] || !exchangeRates[to]) {
            return res.status(400).json({
                success: false,
                message: "Invalid currency code"
            });
        }

        const rate = exchangeRates[to] / exchangeRates[from];

        res.json({
            success: true,
            from,
            to,
            rate: parseFloat(rate.toFixed(4))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.listen(3000, () => {
    console.log("🚀 Currency Converter Server running at http://localhost:3000");
    console.log("💱 Available currencies:", Object.keys(exchangeRates).join(", "));
});
