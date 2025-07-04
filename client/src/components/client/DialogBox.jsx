import PropTypes from 'prop-types';

function DialogBox({ message, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <p style={styles.message}>{message}</p>
        <button onClick={onClose} style={styles.button}>OK</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    width: '300px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'center'
  },
  message: {
    marginBottom: '16px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333'
  },
  button: {
    backgroundColor: '#00b96b',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

DialogBox.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DialogBox;
