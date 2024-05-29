// components/OrderModal.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/OrderModal.module.css';

const OrderModal = ({ show, onClose, type }) => {
  const [amount, setAmount] = useState('');

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{type === 'buy' ? 'Buy NGOLD' : 'Sell NGOLD'}</span>
          <i className="bi bi-x" style={{ fontSize: '32px', cursor: 'pointer', fontWeight: '700' }} onClick={onClose}></i>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.contentHeader}>
            <div>
              <span className={styles.priceLabel}>Price: </span>
              <span className={styles.priceValue}>72.99 USD</span>
            </div>
            <div className={styles.orderTimeContainer}>
              <span className={styles.orderTime}>Order time 16:12</span>
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
          <div className={styles.contentInput}>
            <div className={styles.inputGroup}>
              <div className={styles.inputLeft}>
                <span className={styles.currency}>USD</span>
                <input 
                  type="number" 
                  placeholder="Amount" 
                  className={styles.inputAmount}
                  value={amount}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.selectContainer}>
                <Image src="/images/Polygon.svg" alt="Polygon" width={20} height={20} />
                <select className={styles.select}>
                  <option value="DOT">DOT</option>
                </select>
              </div>
            </div>
            <div className={styles.contentFooter}>
              <div className={styles.balanceInfo}>
                <i className="bi bi-wallet2"></i>
                <span className={styles.balanceLabel}>Balance:</span>
                <span className={styles.balanceValue}>0.00</span>
              </div>
              <button className={styles.useMaxButton}>Use Max</button>
            </div>
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.detailsUsd}>
                <span className={styles.detailsLabel}>Limit USD</span>
                <span className={styles.detailsValue}>5 - 100</span>
            </div>
            <div className={styles.detailsAmount}>
                <span className={styles.detailsLabel}>NGOLD Amount</span>
                <span className={styles.detailsValue}>0.00</span>
            </div>
          </div>
        </div>
        <button
          className={styles.actionButton}
          style={{
            backgroundColor: amount ? (type === 'buy' ? '#4FBC7B' : '#E33939') : '#F4F4F6',
            color: amount ? '#FFFFFF' : '#DDDFE4',
          }}
          disabled={!amount}
        >
          {amount ? (type === 'buy' ? 'BUY NGOLD' : 'SELL NGOLD') : 'Enter A Mount'}
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
