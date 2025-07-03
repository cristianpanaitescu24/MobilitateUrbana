import React from 'react';
import { useState } from "react";

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({ location, onClose }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [obstacle, setObstacle] = useState(false);
  const [size, setSize] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

    // Simulate sending data
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal">
      <h2>Rate This Sidewalk</h2>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)}>{star}★</button>
        ))}
      </div>
      <label>
        Sidewalk Size:
        <input value={size} onChange={(e) => setSize(e.target.value)} />
      </label>
      <label>
        Obstacles:
        <input type="checkbox" checked={obstacle} onChange={() => setObstacle(!obstacle)} />
      </label>
      <button disabled={rating == null || submitting} onClick={handleSubmit}>
        {submitting ? 'Submitting...' : 'Confirm'}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default SidewalkFormModal;