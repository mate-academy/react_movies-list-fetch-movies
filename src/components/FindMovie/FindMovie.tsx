import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addNewMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [title, setTitle] = useState('');
  const [movieSelect, setMovieSelect] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);

  const searchHandler = async () => {
    if (title) {
      const movieFromServer = await getMovie(title);

      setSearchError(movieFromServer.Response === 'False');

      setMovieSelect(movieFromServer);
    }
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setSearchError(false);
  };

  const addToListHandler = () => {
    if (movieSelect) {
      addNewMovie(movieSelect);
      setTitle('');
      setMovieSelect(null);
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
              onChange={inputHandler}
              type="text"
              id="movie-title"
              placeholder="Enter a movie title"
              className={cn('input', { 'is-invalid': searchError })}
            />
          </div>

          {searchError && (
            <p className="help is-danger">
              The movie was not found
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchHandler}
              data-cy="find"
            >
              Search for a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movieSelect}
              onClick={addToListHandler}
              data-cy="add"
            >
              Add movie to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {(movieSelect && !searchError) && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movieSelect} />
          </>
        )}
      </div>
    </>
  );
};
