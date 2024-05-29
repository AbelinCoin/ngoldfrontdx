// pages/p2p.tsx

import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import BuyOrders from '../components/BuyOrders';
import SoldOrders from '../components/SoldOrders';
import styles from '../styles/P2P.module.css';

const P2P: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showBuyOrders, setShowBuyOrders] = useState(true);
  const rowsPerPage = 10;
  const totalRows = 30;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 3 || i > totalPages - 3 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            className={styles.paginationButton}
            style={{
              backgroundColor: i === currentPage ? '#F9FAFB' : 'transparent',
              color: i === currentPage ? '#636A7E' : '#AFB4C0',
            }}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (pages[pages.length - 1] !== '...') {
        pages.push(<span key={i} className={styles.paginationEllipsis}>...</span>);
      }
    }
    return pages;
  };

  return (
    <div>
      <Head>
        <title>P2P - NGOLD</title>
        <meta name="description" content="P2P trading page for NGOLD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.p2pContainer}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <span className={styles.tableHeaderLeft}>P2P NGOLD ORDERS</span>
            <div className={styles.tableHeaderRight}>
              <button
                className={`${styles.tableHeaderRight} ${styles.buyButton}`}
                style={{ color: showBuyOrders ? '#4FBC7B' : '#272727' }}
                onClick={() => setShowBuyOrders(true)}
              >
                BUY
              </button>
              <span className={styles.separator}>|</span>
              <button
                className={`${styles.tableHeaderRight} ${styles.soldButton}`}
                style={{ color: showBuyOrders ? '#272727' : '#E33939' }}
                onClick={() => setShowBuyOrders(false)}
              >
                SOLD
              </button>
            </div>
          </div>
          {showBuyOrders ? <BuyOrders /> : <SoldOrders />}
          <div className={styles.pagination}>
            <button onClick={handlePreviousPage} className={styles.paginationNavButton}>
              <i className="bi bi-arrow-left-short"></i> Previous
            </button>
            <div className={styles.pageNumbers}>
              {renderPagination()}
            </div>
            <button onClick={handleNextPage} className={styles.paginationNavButton}>
              Next <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default P2P;
