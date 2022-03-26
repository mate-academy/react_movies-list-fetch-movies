import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  movies: Movie[],
  setMovies: any,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [fetchError, setFetchError] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  const resetingInputAndError = () => {
    setFetchError(false);
    setMovie(null);
  };

  const findMovie = async () => {
    resetingInputAndError();
    const movieFromServer = await getMovie(query);

    if (movieFromServer.Error) {
      await setFetchError(true);
    } else {
      await setMovie(movieFromServer);
    }
  };

  const handleAddMovie = () => {
    if (!movies.some((movieFromList: Movie) => (
      movieFromList.imdbID === movie?.imdbID
    )) && movie) {
      setMovies([
        ...movies,
        movie,
      ]);
    }

    resetingInputAndError();
    setMovie(null);
  };

  const errorStyle = classNames('input', {
    'is-danger': fetchError,
  });

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={errorStyle}
                value={query}
                onChange={handleInputChange}
              />
            </div>
          </label>

          {fetchError && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {(movie && !fetchError) && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
