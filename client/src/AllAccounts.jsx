import React from 'react';
import server from './server';

const AllAccounts = () => {
    const getAll = async () => {
        try {
            const response = await server.get('/allaccounts');
            console.log('response', response);
            const data = response.data;
            console.log('accounts',data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    return (
        <button onClick={getAll}>Cuentas</button>
    );
};

export default AllAccounts;