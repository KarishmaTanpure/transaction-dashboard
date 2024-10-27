const Transaction = require('../models/transaction');

const parseMonth = (month) => {
    const monthNumber = new Date(Date.parse(`${month} 1, 2023`)).getMonth() + 1;
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        throw new Error("Invalid month");
    }
    return monthNumber;
};

exports.getTransactions = async (req, res) => {
    try {
        const { search, page = 1, perPage = 10, month } = req.query;

        if (!month) {
            return res.status(400).json({ message: "Month is required" });
        }

        const monthNumber = parseMonth(month);

        const matchStage = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
        };

        if (search) {
            matchStage.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $eq: Number(search) } }
            ];
        }

        const total = await Transaction.aggregate([
            { $match: matchStage },
            { $count: "totalCount" }
        ]);

        const totalCount = total.length > 0 ? total[0].totalCount : 0;

        const transactions = await Transaction.aggregate([
            { $match: matchStage },
            { $skip: (page - 1) * perPage },
            { $limit: Number(perPage) }
        ]);

        res.json({
            total: totalCount,
            page: Number(page),
            perPage: Number(perPage),
            transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions: " + error.message });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ message: "Month is required" });
        }

        const monthNumber = parseInt(month, 10); // Ensure the month is an integer
        console.log("Fetching statistics for month:", monthNumber); // Debugging line

        const totalSales = await Transaction.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                    sold: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$price" },
                    totalSoldItems: { $sum: 1 }
                }
            }
        ]);

        const totalNotSold = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
            sold: false
        });

        res.json({
            totalSaleAmount: totalSales[0]?.totalAmount || 0,
            totalSoldItems: totalSales[0]?.totalSoldItems || 0,
            totalNotSoldItems: totalNotSold
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Error fetching statistics: " + error.message });
    }
};

exports.getBarChart = async (req, res) => {
    try {
        const { month } = req.query;

        const monthNumber = parseMonth(month);

        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const barChartData = await Promise.all(priceRanges.map(async (priceRange) => {
            const count = await Transaction.countDocuments({
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                price: { $gte: priceRange.min, $lte: priceRange.max },
            });
            return {
                range: priceRange.range,
                count
            };
        }));

        res.json(barChartData);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ message: "Error fetching bar chart data: " + error.message });
    }
};

exports.getCombinedData = async (req, res) => {
    try {
        const statistics = await exports.getStatistics(req, res); // Call without res
        const barChartData = await exports.getBarChart(req, res); // Call without res

        res.json({
            statistics,
            barChartData,
        });
    } catch (error) {
        console.error("Error fetching combined data:", error);
        res.status(500).json({ message: "Error fetching combined data: " + error.message });
    }
};
