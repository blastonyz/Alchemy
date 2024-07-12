import React, { useState, useEffect } from 'react';
import server from './server';

const AllAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const getAll = async () => {
    try {
      const response = await server.get('/allaccounts');
      console.log('response', response);
      const data = response.data;
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className='table-container'>
        <table className='table'>
      <thead>
        <tr>
          <th>Owner</th>
          <th>Private Key</th>
          <th>Public Key</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account, index) => {
          const privateKey = account[`private${index + 1}`];
          const publicKey = account[`public${index + 1}`];
          return (
            <tr key={index}>
              <td>{account.owner}</td>
              <td>{privateKey}</td>
              <td>{publicKey}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  
      <button onClick={getAll}>Accounts</button>
    </div>
  );
};
export default AllAccounts;