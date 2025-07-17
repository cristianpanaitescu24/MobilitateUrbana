import React, { useState, useEffect } from 'react';
import './SidewalkFormModal.css';
import { submitReport } from '../lib/submitReport';
import { TAG_LABELS, CRITERIA_LABELS } from '../constants/formLabels';
import { Report } from '../components/IReport';
import FloatingMessage from './FloatingMessage';

const criteria = Object.entries(CRITERIA_LABELS);
const tagKeys = Object.keys(TAG_LABELS);

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
  onSubmitSuccess?: (report?: Report | null) => void;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({
  location,
  onClose,
  onSubmitSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [streetName, setStreetName] = useState('Se încarcă...');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [tags, setTags] = useState<string[]>([]);
  const firstRated = ratings[criteria[0][0]] != null;
  const [toast, setToast] = useState<JSX.Element | null>(null);

  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[1]}&lon=${location[0]}`
    )
      .then((res) => res.json())
      .then((data) => {
        const address = data.address || {};
        const street = address.road || 'Stradă necunoscută';
        const number = address.house_number ? ` nr. ${address.house_number}` : '';
        setStreetName(`${street}${number}`);
      })
      .catch(() => setStreetName('Stradă necunoscută'));
  }, [location]);

  useEffect(() => {
    const stored = localStorage.getItem('lastReportConfig');
    if (stored) {
      const { ratings, tags } = JSON.parse(stored);
      setRatings(ratings);
      setTags(tags);
    }
  }, []);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!firstRated) return;
    setSubmitting(true);

    const payload = {
      location,
      ratings,
      tags,
      timestamp: new Date().toISOString(),
    };

    const newReport = await submitReport(payload);

    if (newReport) {
      localStorage.setItem(
        'lastReportConfig',
        JSON.stringify({ ratings, tags })
      );
      onSubmitSuccess?.(newReport);
      setToast(<FloatingMessage message="TRIMIS" type="success" onClose={() => setToast(null)} />);
      onClose();
    } else {
      const errMessage = "EROARE SERVER"
      console.error('Insert error', errMessage);
      setToast(<FloatingMessage message={`RESPINS – ${errMessage}`} type="error" onClose={() => setToast(null)} />);
    }

    setSubmitting(false);
  };

  const handleLastConfig = () => {
    const stored = localStorage.getItem('lastReportConfig');
    if (stored) {
      const { ratings, tags } = JSON.parse(stored);
      setRatings(ratings);
      setTags(tags);
    }
  };

  const handleReset = () => {
    setRatings({});
    setTags([]);
  };

  return (
    <div className="sidewalk-modal">
      <h2>Acordă o notă trotuarului:</h2>
      <div style={{ fontSize: 18 }}>
        <strong>Strada: {streetName}</strong>
      </div>

      <div className="scrollable-container">
        <div className="ratings-container">
          {criteria.map(([key, label]) => (
            <div key={key} className="star-rating-line">
              <label className="rating-label">{label}</label>
              <div className="star-rating-wrapper">
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
            </div>
          ))}
        </div>

        <legend>Probleme/Nereguli</legend>
        <div className="tags-column">
          {tagKeys.map((tagKey) => (
            <button
              key={tagKey}
              className={`tag-button ${tags.includes(tagKey) ? 'active' : ''}`}
              onClick={() => toggleTag(tagKey)}
            >
              {TAG_LABELS[tagKey]}
            </button>
          ))}
        </div>
      </div>


      <div className="form-buttons">
        <button disabled={!firstRated || submitting} onClick={handleSubmit}>
          {submitting ? 'Se trimite...' : 'Trimite'}
        </button>
        <button onClick={handleLastConfig}>Ultimul rating</button>
        <button onClick={handleReset}>Resetează</button>
        <button className="cancel-btn" onClick={onClose}>
          Renunță
        </button>
      </div>
    </div>
  );
};

export default SidewalkFormModal;
