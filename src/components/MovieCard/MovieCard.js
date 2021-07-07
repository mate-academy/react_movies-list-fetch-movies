import React from 'react';
import './MovieCard.scss';
import PropTypes from 'prop-types';

export const MovieCard = ({
  title,
  description = '',
  imgUrl,
  imdbUrl,
  imdbId,
}) => (
  <div className="card">
    {!imdbId ? (
      <div className="card__empty">
        Enter name of the movie
      </div>
    ) : (
      <div className="card__main">
        <div className="card-image">
          <figure className="image is-4by3">
            <img
              src={imgUrl}
              alt="Film logo"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img
                  src="images/imdb-logo.jpeg"
                  alt="imdb"
                />
              </figure>
            </div>
            <div className="media-content">
              <p className="title">{title}</p>
            </div>
          </div>

          <div className="content">
            <p className="description">{description}</p>
            <br />
            <a
              className="IMDB"
              href={imdbUrl}
            >
              IMDB
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
);

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbUrl: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
};
