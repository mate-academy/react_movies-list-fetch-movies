import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

type Props = {
  movies: MovieData[];
  onAddMovie: (movie: MovieData) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasQueryError, setHasQueryError] = useState(false);

  const isFormValid = query.trim();

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasQueryError(false);
  };

  const handleAdd = () => {
    if (!movieData) {
      return;
    }

    const isAlreadyAdded = movies.some(
      movie => movie.imdbID === movieData.imdbID,
    );

    if (!isAlreadyAdded) {
      onAddMovie(movieData);
    }

    setQuery('');
    setMovieData(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await getMovie(query);

      if ('Error' in result) {
        setMovieData(null);
        setHasQueryError(true);
      } else {
        setMovieData(result);
        setHasQueryError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {hasQueryError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                loading ? 'button is-light is-loading' : 'button is-light',
              )}
              disabled={!isFormValid}
            >
              {!movieData ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movieData && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieData} />
        </div>
      )}
    </>
  );
};
