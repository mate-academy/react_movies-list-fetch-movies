import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie;
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img data-cy="moviePoster" src={movie.poster} alt={movie.title} />
        </figure>
      </div>

      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src="images/imdb-logo.jpeg" alt="imdb" />
            </figure>
          </div>

          <div className="media-content">
            <p className="title is-6" data-cy="movieTitle">
              {movie.title}
            </p>
            <p className="subtitle is-6">{movie.year}</p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {movie.description}
          <br />
          <a
            href={`https://www.imdb.com/title/${movie.imdbId}`}
            target="_blank"
            rel="noreferrer"
            data-cy="movieURL"
          >
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
