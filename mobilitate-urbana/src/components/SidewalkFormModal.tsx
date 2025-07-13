import React, { useState, useEffect } from 'react';
import './SidewalkFormModal.css';
import { submitReport } from '../lib/submitReport';
import { criteria, criteriaLabels, issueLabels, issuesInitial, CriterionKey } from '../constants/formLabels';
import { Report } from '../hooks/useUserReports';

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
  onSubmitSuccess?: (newReport: Report) => void;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({ location, onClose, onSubmitSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [streetName, setStreetName] = useState('Se încarcă...');
  const [notes, setNotes] = useState('');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [issues, setIssues] = useState(issuesInitial);

  const firstRated = ratings[criteria[0]] != null;

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[1]}&lon=${location[0]}`)
      .then((res) => res.json())
      .then((data) => setStreetName(data.address?.road || 'Stradă necunoscută'))
      .catch(() => setStreetName('Stradă necunoscută'));
  }, [location]);

  const toggleIssue = (key: keyof typeof issues) => {
    setIssues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!firstRated) return;
    setSubmitting(true);

    const payload = {
      location,
      ratings,
      issues,
      notes,
      timestamp: new Date().toISOString(),
    };

    const newReport = await submitReport(payload);
    setSubmitting(false);

    if (newReport) {
      onSubmitSuccess?.(newReport);
      onClose();
    }
  };

  return (
    <div className="sidewalk-panel">
      <h2>Evaluează acest trotuar</h2>
      <p><strong>Strada:</strong> {streetName}</p>

      <div className="ratings-container">
        {criteria.map((key: CriterionKey) => (
          <div key={key} className="star-rating-line">
            <label className="rating-label">{criteriaLabels[key]}</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() =>
                    setRatings((prev) => ({
                      ...prev,
                      [key]: star,
                    }))
                  }
                  className={`star ${ratings[key] >= star ? 'filled' : ''}`}
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
