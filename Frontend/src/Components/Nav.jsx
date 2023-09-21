import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Nav.module.css';

function Nav({ children }) {
  return (
    <nav className={styles.navContainer}>
      <ul className={styles.listContainer}>
        {children.map((navItem, index) => {
          return (
            <li className={styles.listItem} key={index}>
              <Link className={styles.navLink} to={navItem.link}>
                <div className={styles.navText}>{navItem.text}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Nav;
