import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../helpers/api';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);

  const handleSearch = async () => {
    if (title) {
      const movieFromServer = await getMovie(title);

      setSearchError(movieFromServer.Response === 'False');

      setCurrentMovie(movieFromServer);
    }
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
              className={classNames(
                'input',
                {
                  'is-danger': !title,
                },
              )}
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
              onChange={handleSearch}
              data-cy="find"
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={!currentMovie}
              onClick={handleAddToList}
              data-cy="add"
              type="button"
              className="button is-primary"
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
