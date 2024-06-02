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
  const [isBuySelected, setIsBuySelected] = useState(true);

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

  const handleBuyClick = () => {
    setIsBuySelected(true);
  };

  const handleSellClick = () => {
    setIsBuySelected(false);
  };

  const isFormValid = amount !== '' && price !== '' && minLimit !== '' && maxLimit !== '';

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
              <button
                className={`${styles.buyButton} ${isBuySelected ? '' : styles.inactiveButton}`}
                onClick={handleBuyClick}
              >
                Buy
              </button>
              <span className={styles.separator}>|</span>
              <button
                className={`${styles.soldButton} ${isBuySelected ? styles.inactiveButton : ''}`}
                onClick={handleSellClick}
              >
                Sell
              </button>
            </div>
          </div>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>Asset amount</span>
            <div className={styles.containerInput}>
              <div className={styles.containerInputAmount}>
                <div className={styles.inputRow}>
                  <span className={styles.descriptionContentspan}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className={styles.inputField}
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                <select className={styles.selectField}>
                  <option value="NGOLD">NGOLD</option>
                  <option value="USDT">USDT</option>
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
                  <span className={styles.descriptionContentspan}>$</span>
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
            <div className={styles.contentFormlimit}>
              <span className={styles.formLabel}>Set a limit order</span>
            </div>
            <div className={styles.containerInputs}>
              <div className={styles.inputLimit}>
                <input
                  type="number"
                  placeholder="0"
                  className={styles.inputField}
                  value={minLimit}
                  onChange={handleMinLimitChange}
                />
              </div>
              <div className={styles.inputLimit}>
                <input
                  type="number"
                  placeholder="0"
                  className={styles.inputField}
                  value={maxLimit}
                  onChange={handleMaxLimitChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.footerContent}>
            <div className={styles.descriptionContent}>
              <span className={styles.descriptionContentlabel}>Your price:</span>
              <span className={styles.dynamicText}>{price !== '' ? `$${price}` : '$0.00'}</span>
            </div>
            <div className={styles.descriptionContent}>
              <span className={styles.descriptionContentlabel}>Asset Amount</span>
              <span className={styles.dynamicText}>{amount !== '' ? `$${amount}` : '$0.00'}</span>
            </div>
            <div className={styles.descriptionContent}>
              <span className={styles.descriptionContentlabel}>Your limit:</span>
              <span className={styles.dynamicText}>{minLimit !== '' || maxLimit !== '' ? `${minLimit} - ${maxLimit}` : '0 - 0'}</span>
            </div>
          </div>
        </div>
        <div className={styles.footerContainer}>
          <button
            className={`${styles.postOrderButton} ${isFormValid ? (isBuySelected ? styles.buyActiveButton : styles.sellActiveButton) : ''}`}
            disabled={!isFormValid}
          >
            Post Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostOrderModal;
