import PropTypes from 'prop-types';
import { useState } from "react";

function ProgressHistoryList({ progressList, onSelectProgress }) {
  const [selectedProgress, setSelectedProgress] = useState(null);

  const handleSelect = (progress) => {
    setSelectedProgress(progress);
    onSelectProgress(progress);  // Notify parent component
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Progress History</h3>

      {progressList.length === 0 ? (
        <p>No progress uploaded yet.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Schedule</th>
              <th style={styles.th}>Comments</th>
            </tr>
            </thead>
            <tbody>
            {progressList.map((progress) => (
              <tr
                key={progress._id}
                onClick={() => handleSelect(progress)}
                style={{
                  ...styles.row,
                  backgroundColor: selectedProgress?._id === progress._id ? '#e6f7ff' : '#fff',
                }}
              >
                <td style={styles.td}>{new Date(progress.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>{progress.description}</td>
                <td style={styles.td}>
                  <span style={styles.tag}>{progress.schedule}</span>
                </td>
                <td style={styles.td}>{progress.comments}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', fontFamily: 'Arial' },
  header: { marginBottom: '10px' },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: { width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' },
  th: { backgroundColor: '#f9fafb', padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '14px' },
  td: { padding: '15px', borderBottom: '1px solid #f1f1f1', fontSize: '13px' },
  row: { cursor: 'pointer', transition: 'background-color 0.2s ease' },
  tag: { backgroundColor: '#00b96b', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', display: 'inline-block' },
};

ProgressHistoryList.propTypes = {
  progressList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      schedule: PropTypes.string.isRequired,
      comments: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectProgress: PropTypes.func.isRequired,
};

export default ProgressHistoryList;
