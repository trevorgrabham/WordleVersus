import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Logo.module.css';

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Link className={styles.linkContainer} to="/">
        <div className={styles.linkText}>WordleVersus</div>
      </Link>
    </div>
  );
}

export default Logo;
