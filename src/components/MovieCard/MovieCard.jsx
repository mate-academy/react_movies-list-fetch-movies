import React from 'react';
import './MovieCard.scss';
import PropTypes from 'prop-types';

export const MovieCard = React.memo(({
  title,
  description = '',
  imgUrl,
  imdbId,
}) => (
  <div
    className="movie"
  >
    <img className="movie__poster" src={imgUrl} alt="Film logo" />

    <div className="movie__info">

      <div className="movie__title-box">

        <img className="imdb-logo" src="images/imdb-logo.jpeg" alt="" />

        <a
          href={`https://www.imdb.com/title/${imdbId}`}
          className="movie__title"
        >
          <p>
            {' '}
            {title}
          </p>
        </a>
      </div>

      <p className="movie__description">
        {description.slice(0, 150)}
        ...
      </p>
    </div>
  </div>
));

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
};
