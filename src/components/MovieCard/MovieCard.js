import React from 'react';
import './MovieCard.scss';
import PropTypes from 'prop-types';

export const MovieCard = ({ movie }) => (
  <div className="card">
    <div className="card-image">
      <figure className="image is-4by3">
        <img
          src={movie.Poster}
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
          <p className="title is-8">{movie.Title}</p>
        </div>
      </div>

      <div className="content">
        {movie.Plot}
        <br />
        <a href={movie.Website}>IMDB</a>
      </div>
    </div>
  </div>
);

MovieCard.propTypes = PropTypes.objectOf(PropTypes.shape({
  Title: PropTypes.string.isRequired,
  Plot: PropTypes.string.isRequired,
  Website: PropTypes.string.isRequired,
  Poster: PropTypes.string.isRequired,
})).isRequired;
