import React, { useState, useEffect } from 'react';
import './SidewalkFormModal.css';

import { supabase } from '../utils/supabaseClient';

async function submitReport(json : any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert('User not logged in');

  const { location, ratings, issues, notes, timestamp } = json;

  const { error } = await supabase.from('reports').insert({
    user_id: user.id,
    location: `POINT(${location[0]} ${location[1]})`,
    timestamp,
    satisfaction: ratings["Satisfacție generală"],
    safety: ratings["Siguranță"],
    width: ratings["Lățime"],
    usability: ratings["Utilizabilitate"],
    accessibility: ratings["Accesibilitate"],
    modernization: ratings["Nivel de modernizare"],
    cars: issues.cars,
    signs: issues.signs,
    pavement: issues.pavement,
    stairs: issues.stairs,
    nature: issues.nature,
    notes
  });

  if (error) {
    console.error('Insert error', error);
  } else {
    alert('Submitted successfully!');
  }
}

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({ location, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [streetName, setStreetName] = useState('Se încarcă...');
  const [notes, setNotes] = useState('');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [issues, setIssues] = useState({
    cars: false,
    signs: false,
    pavement: false,
    stairs: false,
    nature: false,
  });

  const criteria = [
    'Satisfacție generală',
    'Siguranță',
    'Lățime',
    'Utilizabilitate',
    'Accesibilitate',
    'Nivel de modernizare',
  ];
  const issueLabels: { [key in keyof typeof issues]: string } = {
    cars: "Mașini parcate",
    signs: "Semne de circulație",
    pavement: "Gropi sau denivelări",
    stairs: "Prezenta scărilor/treptelor",
    nature: "Natură neîngrijită",
  };

  const firstRated = ratings[criteria[0]] != null;

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[1]}&lon=${location[0]}`)
      .then((res) => res.json())
      .then((data) => setStreetName(data.address.road || 'Stradă necunoscută'))
      .catch(() => setStreetName('Stradă necunoscută'));
  }, [location]);

  const toggleIssue = (key: keyof typeof issues) => {
    setIssues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    if (!firstRated) return;
    setSubmitting(true);

    const payload = {
      location,
      ratings,
      issues,
      notes,
      timestamp: new Date().toISOString(),
    };

    console.log('Submitting to Supabase (mocked):', payload);

    submitReport(payload);
    
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="sidewalk-panel">
      <h2>Evaluează acest trotuar</h2>
      <p><strong>Stradă:</strong> {streetName}</p>

      <div className="ratings-container">
        {criteria.map((criterion) => (
          <div key={criterion} className="star-rating-line">
            <label className="rating-label">{criterion}</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() =>
                    setRatings((prev) => ({
                      ...prev,
                      [criterion]: star,
                    }))
                  }
                  className={`star ${ratings[criterion] >= star ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <legend>Probleme observate:</legend>
        <div className="issues-column">
          {Object.keys(issues).map((key) => (
            <button
              key={key}
              className={`issue-button-full ${issues[key as keyof typeof issues] ? 'active' : ''}`}
              onClick={() => toggleIssue(key as keyof typeof issues)}
            >
              {issueLabels[key as keyof typeof issues]}
            </button>
          ))}
        </div>

      <label htmlFor="notes">Observații generale:</label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        placeholder="Scrie aici observațiile generale..."
      />

      <div className="form-buttons">
        <button disabled={!firstRated || submitting} onClick={handleSubmit}>
          {submitting ? 'Se trimite...' : 'Trimite'}
        </button>
        <button className="cancel-btn" onClick={onClose}>Renunță</button>
      </div>
    </div>
  );
};

export default SidewalkFormModal;
