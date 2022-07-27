import React from 'react';
import { Movie } from '../../type/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie;
};

export const MovieCard: React.FC<Props> = (props) => {
  const { movie } = props;

  const foundedMovie = (
    <div className="card">
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

  const notFoundedMovie = (
    <div
      className="block has-background-danger-light"
      style={{ borderRadius: 10 }}
    >
      <p className="subtitle has-text-danger p-5">
        Error - 404
      </p>
    </div>
  );

  return String(movie.Response) === 'True' ? foundedMovie : notFoundedMovie;
};
