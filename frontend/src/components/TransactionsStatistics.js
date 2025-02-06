
import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../api/TransactionsApi';
import './TransactionsStatistics.css';

const TransactionsStatistics = ({ month }) => {
    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
    });

    useEffect(() => {
        const fetchAndSetStatistics = async () => {
            if (month) {
                try {
                    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;
                    console.log("Fetching statistics for month number:", monthNumber);

                    const data = await fetchStatistics(monthNumber); 
                    console.log("Fetched statistics:", data);

                 
                    setStatistics({
                        totalSaleAmount: data.totalSaleAmount,
                        totalSoldItems: data.totalSoldItems,
                        totalNotSoldItems: data.totalNotSoldItems
                    });
                } catch (error) {
                    console.error("Error fetching statistics:", error);
                }
            }
        };

        fetchAndSetStatistics();
    }, [month]);

    return (
        <div className="statistics-container">
            <h3>Transaction Statistics for {month || 'Selected Month'}</h3>
            <div className="statistics-details">
                <p><strong>Total Sale Amount:</strong> ${statistics.totalSaleAmount.toFixed(2)}</p>
                <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
                <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
            </div>
        </div>
    );
};

export default TransactionsStatistics;
