import React from 'react';
import styles from '../Styles/Logo.module.css';

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <a className={styles.linkContainer} href="/">
        <div className={styles.linkText}>WordleVersus</div>
      </a>
    </div>
  );
}

export default Logo;
