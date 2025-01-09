import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    data-test-id={'modals-overlay'}
    className={styles.overlay}
    onClick={onClick}
  />
);
