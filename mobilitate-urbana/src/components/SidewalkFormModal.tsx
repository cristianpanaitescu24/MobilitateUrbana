import React from 'react';
import { useState, useEffect } from 'react';
import './SidewalkFormModal.css';

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({ location, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [streetName, setStreetName] = useState('Loading...');

  const [notes, setNotes] = useState('');

  const [issues, setIssues] = useState({
    cars: false,
    signs: false,
    pavement: false,
    stairs: false,
    nature: false,
  });

  const [issueLabeles, setIssueLabeles] = useState({
    cars: "Masini parcate pe trotuar",
    signs: "Semne de circulatie deteriorate",
    pavement: "Gropi sau trotuar denivelat",
    stairs: "Necesita urcarea scarilor",
    nature: "Natura neingrijita",
  });

  const toggleIssue = (key: keyof typeof issues) => {
    setIssues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatLabel = (key: string) =>
  key.charAt(0).toUpperCase() + key.slice(1) + ' Issue';

  const criteria = ["Satisfactie generala", "Siguranta", "Latime", "Utilizabilitate", "Accesibilitate", "Nivel modernizare"];
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const firstRated = ratings[criteria[0]] != null;

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[1]}&lon=${location[0]}`)
      .then(res => res.json())
      .then(data => setStreetName(data.address.road || "Unknown street"))
      .catch(() => setStreetName("Unknown street"));
  }, [location]);

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

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  
  return (
    <div className="sidewalk-panel">
      <h2>Acorda o nota acestui trotuar:</h2>
      <p><strong>Street:</strong> {streetName}</p>

      <div className="ratings-container">
        {criteria.map((criterion) => (
          <div key={criterion} className="star-rating-line">
            <label>{criterion}</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() =>
                  setRatings((prev) => ({
                    ...prev,
                    [criterion]: star,
                  }))
                }
                className={ratings[criterion] === star ? "selected" : ""}
              >
                {star}★
              </button>
            ))}
          </div>
        ))}
      </div>


      <legend>Probleme observate:</legend>
      {Object.keys(issues).map((key) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={issues[key as keyof typeof issues]}
              onChange={() => toggleIssue(key as keyof typeof issues)}
            />
            {issueLabeles[key as keyof typeof issueLabeles]}
          </label>
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="notes">Observatii generale:</label>
        <br />
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            resize: 'vertical',
          }}
          placeholder="Scrieți aici observațiile generale..."
        />
      </div>

      <button disabled={!firstRated || submitting} onClick={handleSubmit}>
        {submitting ? 'Trimitere...' : 'Trimite'}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default SidewalkFormModal;