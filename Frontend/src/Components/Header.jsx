import React from 'react';
import Nav from './Nav';
import Logo from './Logo';
import styles from '../Styles/Header.module.css';

function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.navContainer}>
        <Nav>
          {[
            { link: '/game', text: 'Game Room' },
            { link: '/room', text: 'Room' },
            { link: '/signup', text: 'Sign Up' },
            { link: '/login', text: 'Log In' },
          ]}
        </Nav>
      </div>
    </div>
  );
}

export default Header;
