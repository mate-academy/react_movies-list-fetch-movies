import React from 'react';

export const NotFoundPage: React.FC = React.memo(() => {
  return (
    <div className="NotFoundPage is-overlay">
      <figure className="image">
        <img alt="Not found page" src="https://cdn.dribbble.com/users/6425/screenshots/5039369/error-glitch-gif-3.gif" />
      </figure>
    </div>
  );
});
