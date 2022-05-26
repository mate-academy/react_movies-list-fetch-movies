import React, { FormEvent, useCallback, useState } from 'react';
import './FindMovie.scss';
import { getMovieFS } from '../../Api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [searchStr, setSearchStr] = useState('');

  const getMovie = useCallback(async () => {
    if (searchStr.trim()) {
      const searchResult = await getMovieFS(searchStr);

      // eslint-disable-next-line no-console
      console.log(searchResult);

      if (searchResult.Response === 'True') {
        setMovie(searchResult);
        setError('');
      } else {
        setError('Can not find with this param');
      }
    } else {
      setError('Please type search field');
    }
  }, [searchStr]);

  const addHandler = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!error && movie) {
      addMovie(movie);
      setMovie(null);
      setSearchStr('');
    }
  }, [movie, error]);

  return (
    <>
      <form className="find-movie" onSubmit={addHandler}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={searchStr}
              onChange={(event) => {
                setSearchStr(event.target.value);
              }}
            />
          </div>
          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addHandler}
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
