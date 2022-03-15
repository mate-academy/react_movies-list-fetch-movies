import React, { useState } from 'react';
import classNames from 'classnames';

import { getMovieByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  onMovieAdd: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isError, setIsError] = useState(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const onFindClick = () => {
    getMovieByTitle(title)
      .then(mov => setMovie(mov))
      .then(() => setIsError(true));
  };

  const onAddClick = () => {
    if (movie) {
      onMovieAdd(movie);
    }

    setTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="control">
          <input
            type="text"
            id="movie-title"
            placeholder="Enter a movie title to search"
            className={classNames(
              'input',
              { 'is-danger': !movie && isError },
            )}
            value={title}
            onChange={onTitleChange}
          />
        </div>

        {!movie && isError && (
          <p className="error">
            Can not find a movie with such a title
          </p>
        )}

        <div className="buttons">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFindClick}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => onAddClick()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
