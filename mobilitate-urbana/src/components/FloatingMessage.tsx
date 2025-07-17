import { useEffect, useState } from 'react';
import './FloatingMessage.css';

interface Props {
  message: string;
  type?: 'success' | 'error';
  onClose?: () => void;
}

const FloatingMessage: React.FC<Props> = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return visible ? (
    <div className={`floating-message ${type}`}>
      {message}
    </div>
  ) : null;
};

export default FloatingMessage;