import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchTransactions = async (params) => {
    if (!params || Object.keys(params).length === 0) {
        console.error("No parameters provided for fetching transactions.");
        throw new Error("No parameters provided"); 
    }

    
    console.log("Fetching transactions with params:", params);

    try {
        const response = await axios.get(`${API_URL}/transactions`, { params });
        
       
        if (!response.data || typeof response.data !== 'object') {
            console.error("Unexpected response structure:", response.data);
            throw new Error("Unexpected response structure");
        }

        return response.data; 
    } catch (error) {
            console.error("Error fetching transactions:", error.response?.data || error.message);
            throw new Error(error.response.data.message || "Error fetching transactions");
      
    }
};


export const fetchStatistics = async (month) => {
    if (!month) {
        console.error("Month is required for fetching statistics.");
        throw new Error("Month is required");
    }

    console.log("Fetching statistics for month:", month);
    
    try {
        const response = await axios.get(`${API_URL}/transactions/statistics`, { params: { month } });
        return response.data; 
    } catch (error) {
        console.error("Error fetching statistics:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error fetching statistics"); 
    }
};




export const fetchBarChartData = async (month) => {
    if (!month) {
        console.error("Month is required for fetching bar chart data.");
        throw new Error("Month is required");
    }

    const monthIndex = isNaN(month) 
    ? new Date(`1 ${month} 2021`).getMonth() + 1  
    : parseInt(month, 10); 

    if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
        console.error("❌ Invalid month format:", month);
        throw new Error("Invalid month format");
    }


    try {
        console.log("📌 Fetching bar chart data for month:", monthIndex);
        const response = await axios.get(`${API_URL}/transactions/bar-chart`, { params: { month: monthIndex } });
        console.log("API response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching bar chart data:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error fetching bar chart data");
    }
};
