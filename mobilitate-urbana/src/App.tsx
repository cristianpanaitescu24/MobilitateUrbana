import { Map } from '@vis.gl/react-maplibre';
import { middleOfBucharest } from './lib/constants';
import { useState } from 'react';
import YouAreHere from './components/you-are-here';

export default function App() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [clickCoords, setClickCoords] = useState<[number, number] | null>(null);

  const handleMapClick = (e: any) => {
    const { lngLat } = e;
    setClickCoords([lngLat.lng, lngLat.lat]);
    setShowPrompt(true);
    setRating(null);
  };

  const handleConfirm = () => {
    if (rating && clickCoords) {
      console.log('User rated', rating, 'at', clickCoords);
      // Here you could send the data to a server, etc.
      setShowPrompt(false);
    }
  };

  const handleCancel = () => {
    setShowPrompt(false);
    setRating(null);
    setClickCoords(null);
  };

  return (
    <>
      <Map
        initialViewState={{
          longitude: middleOfBucharest[0],
          latitude: middleOfBucharest[1],
          zoom: 13
        }}
        mapStyle="/styles/style_americana.json"
        onClick={handleMapClick}
        style={{ width: '100vw', height: '100vh' }}
      >
        <YouAreHere />
      </Map>

      {showPrompt && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Rate this sidewalk</h2>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: 32,
                    cursor: 'pointer',
                    color: rating && rating >= star ? 'orange' : 'lightgray'
                  }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <div style={styles.buttons}>
              <button onClick={handleCancel}>Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={rating === null}
                style={{
                  marginLeft: 10,
                  backgroundColor: rating === null ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: rating === null ? 'not-allowed' : 'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 300,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  stars: {
    margin: '10px 0',
    textAlign: 'center'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
};