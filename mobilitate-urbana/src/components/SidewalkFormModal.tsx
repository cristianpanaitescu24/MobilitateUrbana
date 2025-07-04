import React from 'react';
import { useState, useEffect } from 'react';
import './SidewalkFormModal.css';

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({ location, onClose }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [obstacle, setObstacle] = useState(false);
  const [size, setSize] = useState<number>(2);
  const [submitting, setSubmitting] = useState(false);
  const [streetName, setStreetName] = useState('Loading...');

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[1]}&lon=${location[0]}`)
      .then(res => res.json())
      .then(data => setStreetName(data.address.road || "Unknown street"))
      .catch(() => setStreetName("Unknown street"));
  }, [location]);

  const handleSubmit = () => {
    if (rating == null) return;
    setSubmitting(true);

    const payload = {
      location,
      rating,
      obstacle,
      size,
      timestamp: new Date().toISOString(),
    };

    console.log('Submitting to Supabase (mocked):', payload);

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="sidewalk-panel">
      <h2>Rate This Sidewalk</h2>
      <p><strong>Street:</strong> {streetName}</p>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={rating === star ? 'selected' : ''}
          >
            {star}★
          </button>
        ))}
      </div>

      <div className="tabs">
        <button className="active">Rating</button>
        <button>Advanced</button>
      </div>

      <label>Sidewalk width</label>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />

      <fieldset>
        <legend>Obstructions</legend>
        <label>
          <input
            type="checkbox"
            checked={obstacle}
            onChange={() => setObstacle(!obstacle)}
          />{' '}
          Obstructions
        </label>
        {/* Add other checkboxes like Vehicles, Trash, etc */}
      </fieldset>

      {/* Optional star ratings */}
      <div className="category-stars">
        <label>Safety</label>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s}>★</span>
          ))}
        </div>
      </div>

      <textarea placeholder="General observations..." />

      <button disabled={rating == null || submitting} onClick={handleSubmit}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default SidewalkFormModal;