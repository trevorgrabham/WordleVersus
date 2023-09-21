import React from 'react';
import styles from '../Styles/Nav.module.css';

function Nav({ children }) {
  return (
    <nav className={styles.navContainer}>
      <ul className={styles.listContainer}>
        {children.map((navItem, index) => {
          return (
            <li className={styles.listItem} key={index}>
              <a className={styles.navLink} href={navItem.link}>
                <div className={styles.navText}>{navItem.text}</div>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Nav;
