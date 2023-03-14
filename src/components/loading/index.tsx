import { NextPage } from 'next';
import styles from './loading.module.css';

const Loading: NextPage = () => {
  return <p className={styles.loader}>Loading...</p>
}

export default Loading;