/* eslint-disable react/require-default-props */
import classNames from 'classnames';
import React, { useState } from 'react';
import './MovieCard.scss';

type Props = {
  movies: Movie[],
  movie: Movie,
  propAddMovie?: (movie: Movie) => void,
};

export const MovieCard: React.FC<Props> = ({ movies, movie, propAddMovie }) => {
  const [isListed, setIsListed] = useState(false);

  const checkListed = () => {
    setIsListed(movies.map(each => each.imdbID)
      .includes(movie.imdbID));
  };

  const addMovie = () => {
    if (movie) {
      if (propAddMovie) {
        propAddMovie(movie);
      }
    }

    checkListed();
  };

  return (
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

        <div className="control">
          <button
            type="button"
            className={classNames(
              'button', 'is-primary',
              { 'is-hidden': isListed },
            )}
            onClick={addMovie}
          >
            Add to the list
          </button>
        </div>

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
            <p className="title is-4">
              {movie.Title}
            </p>
          </div>

        </div>

        <div className="content">
          {movie.Plot}
          <br />
        </div>
      </div>
    </div>
  );
};
