import React from 'react';

import './MovieCard.scss';

import { Movie } from '../../react-app-env';

interface Props {
  id: string,
  movie: Movie,
}

export const MovieCard: React.FC<Props> = ({ id, movie }) => {
  return (
    <div className="card" key={id}>
      <div className="card-image" data-cy="card-image">
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
            <p className="title is-8" data-cy="movie-title">{movie.Title}</p>
          </div>
        </div>

        <div className="content" data-cy="content">
          {movie.Plot}
          <br />
        </div>
      </div>
    </div>
  );
};
