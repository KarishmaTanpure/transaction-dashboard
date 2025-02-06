import React, { useState } from 'react';
import TransactionsTable from '../components/TransactionsTable';
import TransactionsStatistics from '../components/TransactionsStatistics';
import TransactionsBarChart from '../components/TransactionsBarChart';
import './Dashboard.css';

const Dashboard = () => {
    const [month, setMonth] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-title-container">
                    <h1 className="dashboard-title">Transaction Dashboard</h1>
                </div>
            </div>
            <div className="month-selector-container">
                <div className="search-container">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search Transactions"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <div className="month-select-container"> 
                    <select 
                        id="month-select"
                        className="month-select"
                        value={month || ''} 
                        onChange={(e) => setMonth(e.target.value || null)} 
                    >
                        <option value="" disabled>Select Month</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </div>
            </div>
            {month && (
                <>
                    <TransactionsTable month={month} searchTerm={searchTerm} />
                    <TransactionsStatistics month={month} />
                    <TransactionsBarChart month={month} />
                </>
            )}
        </div>
    );
};

export default Dashboard;
