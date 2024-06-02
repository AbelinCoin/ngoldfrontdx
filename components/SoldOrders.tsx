// components/SoldOrders.tsx

import React, { useState } from 'react';
import OrderModal from './OrderModal';
import styles from '../styles/P2P.module.css';

const SoldOrders: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const rowsPerPage = 8;
  const statuses = ['online', 'offline', 'none'];
  const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

  const renderTableRows = () => {
    const rows = [];
    for (let i = 0; i < rowsPerPage; i++) {
      const status = getRandomStatus();
      rows.push(
        <tr key={i}>
          <td className={styles.userCell}>
            Olivia Rhye <br /><span className={styles.username}>olivia</span>
          </td>
          <td className={styles.statusCell}>
            <div className={`${styles.statusBox}`}>
              <span className={`${styles.statusCircle} ${styles[status]}`}></span>
              <span className={styles.status}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          </td>
          <td className={styles.centeredCell}>68.0 USD</td>
          <td className={styles.centeredCell}>5 - 100 <br /><span className={styles.limit}>362 - 7250 USD</span></td>
          <td className={styles.centeredCell}>
            <button className={styles.sellButton} onClick={() => setShowModal(true)}>Sell</button>
          </td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.leftAlignedHeader}>User name</th>
            <th className={styles.centeredHeader}>Status</th>
            <th className={styles.centeredHeader}>Price</th>
            <th className={styles.centeredHeader}>Limit</th>
            <th className={styles.centeredHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
      <OrderModal show={showModal} onClose={() => setShowModal(false)} type="sell" />
    </>
  );
};

export default SoldOrders;
