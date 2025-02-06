import React, { useEffect, useState } from 'react';
import { fetchBarChartData } from '../api/TransactionsApi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import './TransactionsBarChart.css';

const TransactionsBarChart = ({ month }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Month parameter:", month);
            if (!month) {
                console.error("Month is required to fetch data.");
                setError("Month is required for displaying data.");
                return;
            }

            try {
                const monthIndex = new Date(Date.parse(month + " 1, 2021")).getMonth();
                if (monthIndex === -1) {
                    throw new Error("Invalid month name");
                }

                const chartData = await fetchBarChartData(monthIndex + 1);
                setData(chartData);
            } catch (error) {
                console.error("Error fetching bar chart data:", error);
                setError("Error fetching data");
            }
        };

        fetchData();
    }, [month]);

    if (error) {
        return <div>{error}</div>;
    }

    if (data.length === 0) {
        return <div>No data available for {month}.</div>;
    }

    
    const formattedData = [
        { range: '0 - 100', count: data[0]?.count || 0 },
        { range: '101 - 200', count: data[1]?.count || 0 },
        { range: '201 - 300', count: data[2]?.count || 0 },
        { range: '301 - 400', count: data[3]?.count || 0 },
        { range: '401 - 500', count: data[4]?.count || 0 },
        { range: '501 - 600', count: data[5]?.count || 0 },
        { range: '601 - 700', count: data[6]?.count || 0 },
        { range: '701 - 800', count: data[7]?.count || 0 },
        { range: '801 - 900', count: data[8]?.count || 0 },
        { range: '901 - above', count: data[9]?.count || 0 },
    ];

    return (
        <div className="chart-container">
            <h3 className="chart-title">Bar Chart Stats - {month || "selected month"}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="range" 
                        interval={0} 
                        angle={-30} 
                        textAnchor="end" 
                        height={80} 
                    />
                    <YAxis ticks={[0, 20, 40, 60, 80]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionsBarChart;
