import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

function tranformData(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [hasQueryError, setHasQueryError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasQueryError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasQueryError(!query);

    if (!query) {
      return;
    }

    setLoading(true);

    if (query) {
      setLoading(true);

      getMovie(query)
        .then(data => {
          if ('Response' in data && data.Response === 'False') {
            setHasQueryError(true);
          } else {
            const newMovie = tranformData(data as MovieData);

            setMovie(newMovie);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const addToList = (newMovie: Movie) => {
    onAdd(newMovie);
    setMovie(null);
    setQuery('');
    setHasQueryError(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
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
              className={classNames('input is-light', {
                'is-danger': hasQueryError,
              })}
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
              className={classNames('button', { 'is-loading': loading })}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                onClick={() => addToList(movie)}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <>
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        </>
      )}
    </>
  );
};
