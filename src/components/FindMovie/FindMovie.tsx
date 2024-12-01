import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovieCard } from '../../services/getMovieCard';

type Props = {
  onMovieAdd: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({
  onMovieAdd = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const movie = getMovieCard(movieData);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query.toLowerCase().trim())
      .then(result => {
        if ('Error' in result) {
          setMovieData(null);
          setIsError(true);
        } else {
          setMovieData(result);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleAddMovieCard = () => {
    if (movie) {
      onMovieAdd(movie);
    }

    setMovieData(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
      >
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
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {isError && (
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieCard}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">
            Preview
          </h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
