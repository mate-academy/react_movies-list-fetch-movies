import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);

  function normalizeMovie(data: MovieData): Movie {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          setLoading(true);
          const preparedQuery = query.trim().toLowerCase();

          getMovie(preparedQuery)
            .then(result => {
              if ('Response' in result && result.Response === 'False') {
                setError("Can't find a movie with such a title");
                setMovie(null);
              } else {
                setMovie(result as MovieData);
              }
            })
            .finally(() => setLoading(false));
        }}
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
                'is-danger': error,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setError('');
              }}
            />
          </div>

          {!loading && error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
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
              disabled={query.trim() === ''}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {!loading && !error && movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movies.some(m => m.imdbId === movie.imdbID)) {
                    setQuery('');
                    setMovie(null);
                  }

                  onAddMovie(normalizeMovie(movie));
                  setQuery('');
                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {!loading && !error && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={normalizeMovie(movie)} />}
        </div>
      )}
    </>
  );
};
