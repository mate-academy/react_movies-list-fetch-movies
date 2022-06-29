import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);

  const handleSearch = async () => {
    const movieFromServer = await getMovie(title);

    setSearchError(movieFromServer.Response === 'False');

    setCurrentMovie(movieFromServer);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setSearchError(false);
  };

  const handleAddToList = () => {
    if (currentMovie) {
      addMovie(currentMovie);
      setTitle('');
      setCurrentMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={handleInput}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': !title })}
            />
          </div>

          {searchError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleSearch}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!currentMovie}
              onClick={handleAddToList}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {(currentMovie && !searchError) && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={currentMovie} />
          </>
        )}
      </div>
    </>
  );
};
