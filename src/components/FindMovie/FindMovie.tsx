import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  movies: Movie[] | [];
  setMovies: (newArr: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(false);
    setIsLoading(true);
    const normalizeQuery = query.trim();

    if (!normalizeQuery) {
      setError(true);
      setIsLoading(false);

      return;
    } else {
      getMovie(normalizeQuery)
        .then(data => {
          if ('Error' in data) {
            setError(true);
            setMovie(null);
          } else {
            setError(false);
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : data.Poster,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
          }
        })
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    }
  };

  const handleAddButton = () => {
    if (movies.find(item => item.imdbId === movie?.imdbId)) {
      setQuery('');
      setMovie(null);

      return;
    }

    if (movie) {
      setQuery('');
      setMovie(null);
      setError(false);
      setMovies([...movies, movie]);
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {error && !!query.length && !movies.length && (
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
              disabled={!query}
              onClick={event => {
                event.preventDefault();
                handleSubmit(event);
              }}
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              {movie ? `Search again` : `Find a movie`}
            </button>
          </div>
          {!!movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
