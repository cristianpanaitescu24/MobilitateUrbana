import React, { useState, useEffect } from 'react';
import './SidewalkFormModal.css';
import { submitReport, updateReport } from '../lib/submitReport';
import { TAG_LABELS, CRITERIA_LABELS } from '../constants/formLabels';
import { Report } from '../components/IReport';
import FloatingMessage from './FloatingMessage';
import { getStreetNameFromCoords } from '../lib/getStreetNameFromCoords';

const criteria = Object.entries(CRITERIA_LABELS);
const tagKeys = Object.keys(TAG_LABELS);

interface SidewalkFormModalProps {
  location: [number, number];
  onClose: () => void;
  onDelete: () => void;
  onSubmitSuccess?: (report?: Report | null) => void;
  existingReport?: Report;
  isEditMode?: boolean;
}

const SidewalkFormModal: React.FC<SidewalkFormModalProps> = ({
  location,
  onClose,
  onSubmitSuccess,
  existingReport,
  isEditMode,
  onDelete,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [streetName, setStreetName] = useState('Se încarcă...');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [tags, setTags] = useState<string[]>([]);
  const firstRated = ratings[criteria[0][0]] != null;
  const [toastMessage, setToastMessage] = useState<JSX.Element | null>(null);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    getStreetNameFromCoords(location).then(setStreetName);
  }, [location]);

  useEffect(() => {
    if (existingReport) {
      setRatings(existingReport.ratings || {});
      setTags(existingReport.tags || []);
    }
  }, [existingReport]);

  useEffect(() => {
    if (existingReport?.location) {
      getStreetNameFromCoords(existingReport.location).then(setStreetName);
    }
  }, [existingReport?.location]);

  useEffect(() => {
    if (!isEditMode) {
      const stored = localStorage.getItem('lastReportConfig');
      if (stored) {
        const { ratings, tags } = JSON.parse(stored);
        setRatings(ratings);
        setTags(tags);
      }
    }
  }, [isEditMode]);

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

    let result: Report | null = null;

    if (isEditMode && existingReport?.id) {
      result = await updateReport(existingReport.id, payload);
    } else {
      result = await submitReport(payload);
    }
    

    if (result) {
      localStorage.setItem('lastReportConfig', JSON.stringify({ ratings, tags }));
      setToastMessage(
        <FloatingMessage
          message={isEditMode ? 'Actualizat cu succes!' : 'Trimis cu succes!'}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      );

      setFormVisible(false);
      onSubmitSuccess?.(result);
      setTimeout(() => {
        onClose();
      }, 2000);

    } else {
      setToastMessage(
        <FloatingMessage
          message="Eroare la trimitere"
          type="error"
          onClose={() => setToastMessage(null)}
        />
      );
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
    <>
      {toastMessage}

      {formVisible && (
        <div className="sidewalk-modal">
          <div style={{ fontSize: 18 }}>
            <strong>Strada: {streetName}</strong>
          </div>

          <div className="config-icons">
            <button onClick={handleLastConfig} title="Încarcă ultima configurare">
              🔄
            </button>
            <button onClick={handleReset} title="Resetează">
              ♻️
            </button>
          </div>

          <div className="ratings-container">
            {criteria.map(([key]) => (
              <div key={key} className="star-rating-line">
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

          <div className="scrollable-container">
            

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

          <div className="form-buttons compact">
            {isEditMode && (
              <button className="delete-btn" onClick={() => onDelete?.()}>
                🗑️
              </button>
            )}
            <button className="cancel-btn" onClick={onClose}>
              Renunță
            </button>
            <button
              disabled={!firstRated || submitting}
              onClick={handleSubmit}
              className="submit-btn"
            >
              {submitting ? 'Se trimite...' : isEditMode ? 'Actualizează' : 'Trimite'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SidewalkFormModal;
