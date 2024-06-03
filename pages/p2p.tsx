// pages/p2p.tsx

import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import BuyOrders from '../components/BuyOrders';
import SoldOrders from '../components/SoldOrders';
import Orders from '../components/Orders';
import styles from '../styles/P2P.module.css';

const P2P: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState('buy');
  const rowsPerPage = 8;
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
                className={`${styles.tableHeaderRight} ${styles.ordersButton}`}
                style={{
                  backgroundColor: selectedTab === 'orders' ? '#FFF' : '#DDDFE4',
                  color: selectedTab === 'orders' ? '#FFB60A' : '#FFF',
                }}
                onClick={() => setSelectedTab('orders')}
              >
                ORDERS
              </button>
              <button
                className={`${styles.tableHeaderRight} ${styles.buyButton}`}
                style={{ color: selectedTab === 'buy' ? '#4FBC7B' : '#272727' }}
                onClick={() => setSelectedTab('buy')}
              >
                BUY
              </button>
              <span className={styles.separator}>|</span>
              <button
                className={`${styles.tableHeaderRight} ${styles.soldButton}`}
                style={{ color: selectedTab === 'sell' ? '#E33939' : '#272727' }}
                onClick={() => setSelectedTab('sell')}
              >
                SOLD
              </button>
            </div>
          </div>
          {selectedTab === 'buy' && <BuyOrders />}
          {selectedTab === 'sell' && <SoldOrders />}
          {selectedTab === 'orders' && <Orders />}
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