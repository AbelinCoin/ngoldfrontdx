import React, { useState } from 'react';
import styles from '../styles/PostOrderModal.module.css';

interface PostOrderModalProps {
  show: boolean;
  onClose: () => void;
}

const PostOrderModal: React.FC<PostOrderModalProps> = ({ show, onClose }) => {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [minLimit, setMinLimit] = useState('');
  const [maxLimit, setMaxLimit] = useState('');

  if (!show) {
    return null;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleMinLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinLimit(e.target.value);
  };

  const handleMaxLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxLimit(e.target.value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.headerContainer}>
          <h2 className={styles.modalTitle}>Post Order</h2>
          <i className="bi bi-x" style={{ fontSize: '32px', cursor: 'pointer', fontWeight: '700' }} onClick={onClose}></i>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>I want to</span>
            <div className={styles.containerButtons}>
              <button className={styles.buyButton}>BUY</button>
              <span className={styles.separator}>|</span>
              <button className={styles.soldButton}>Sold</button>
            </div>
          </div>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>Asset amount</span>
            <div className={styles.containerInput}>
              <div className={styles.containerInputAmount}>
                <div className={styles.inputRow}>
                  <span>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className={styles.inputField}
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                <select className={styles.selectField}>
                  <option value="USDT">USDT</option>
                  <option value="NGOLD">NGOLD</option>
                </select>
              </div>
              <div className={styles.containerInputFooter}>
                <div className={styles.containerInputFooterBalance}>
                  <span>Balance</span>
                  <span>0.00</span>
                </div>
                <button className={styles.useMaxButton}>Use Max</button>
              </div>
            </div>
          </div>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>Set a price</span>
            <div className={styles.containerInput}>
              <div className={styles.containerInputAmount}>
                <div className={styles.inputRow}>
                  <span>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className={styles.inputField}
                    value={price}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contentForm}>
            <div className={styles.contentForm}>
              <span className={styles.formLabel}>Set a limit order</span>
              <span className={styles.formSubLabel}>Min - Max</span>
            </div>
            <div className={styles.containerInputs}>
              <div className={styles.inputLimit}>
                <input
                  type="number"
                  placeholder="0.00"
                  className={styles.inputField}
                  value={minLimit}
                  onChange={handleMinLimitChange}
                />
              </div>
              <div className={styles.inputLimit}>
                <input
                  type="number"
                  placeholder="0.00"
                  className={styles.inputField}
                  value={maxLimit}
                  onChange={handleMaxLimitChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.footerContent}>
            <div className={styles.descriptionContent}>
              <span>Your price:</span>
              <span>$0.00</span>
            </div>
            <div className={styles.descriptionContent}>
              <span>Asset Amount</span>
              <span>$0.00</span>
            </div>
            <div className={styles.descriptionContent}>
              <span>Your limit:</span>
              <span>0 - 0</span>
            </div>
          </div>
        </div>
        <div className={styles.footerContainer}>
          <button className={styles.postOrderButton}>Post Order</button>
        </div>
      </div>
    </div>
  );
};

export default PostOrderModal;
