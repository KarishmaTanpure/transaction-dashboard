import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../api/TransactionsApi';
import './TransactionsTable.css';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0); 
    const [page, setPage] = useState(1); 
    const [perPage] = useState(10); 

    useEffect(() => {
        const fetchAndSetTransactions = async () => {
            if (!month) {
                console.error('Month is required for fetching transactions.');
                return;
            }
            
            try {
                const response = await fetchTransactions({ month, page, perPage });
                setTransactions(response.transactions);
                setTotalCount(response.totalCount); 
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
    
        fetchAndSetTransactions();
    }, [month, page, perPage]);

    const handleNextPage = () => {
        if (page * perPage < totalCount) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((t) => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.title}</td>
                                <td>{t.description}</td>
                                <td>{t.price}</td>
                                <td>{t.category}</td>
                                <td>{t.sold ? 'Yes' : 'No'}</td>
                                <td>
                                    <img src={t.image} alt={t.title} style={{ width: '50px', height: '50px' }} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No transactions found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-container">
                <span className="page-number">
                    Page {page}
                </span>
                <div className="pagination-buttons">
                    <span 
                        onClick={handlePreviousPage} 
                        className={`pagination-text ${page === 1 ? 'disabled' : ''}`}
                    >
                        Previous
                    </span>
                    <span 
                        onClick={handleNextPage} 
                        className={`pagination-text ${page * perPage >= totalCount ? 'disabled' : ''}`}
                    >
                        Next
                    </span>
                </div>
                <span className="per-page">
                    {perPage} per page
                </span>
            </div>
        </div>
    );
};

export default TransactionsTable;
