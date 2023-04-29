import * as React from 'react';
import styles from './layout.module.css';

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => (
  <div className={styles.container}>
    {children}
  </div>
)

export default Layout
