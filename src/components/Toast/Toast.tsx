import cn from 'classnames';
import React from 'react';
import './Toast.scss';

type Props = {
  text: string;
  onSetText: (errorText: string) => void;
  errorType?: 'error' | 'warning' | 'info';
};

export const Toast: React.FC<Props> = ({ text, onSetText, errorType }) => {
  const timeout = 3000;
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (text) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onSetText('');
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [text, onSetText]);

  if (!isVisible && !text) {
    return;
  }

  return (
    <div
      className={cn('notification toast', {
        [`is-${errorType}`]: errorType,
        'is-hidden': !isVisible,
      })}
    >
      <p>{text}</p>
    </div>
  );
};
