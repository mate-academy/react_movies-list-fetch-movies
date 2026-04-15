import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { ResponseError } from '../../types/ReponseError';

const baseMovieUrl = 'https://www.imdb.com/title/';

type Props = {
  addMovie: (movie: Movie) => void;
};

const FindMovieComponent: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);

  useEffect(() => {
    setError(null);
  }, [query]);

  const requestMovie = () => {
    setLoading(true);
    setMovie(null);
    setError(null);
    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(response);
          setMovie(null);

          return;
        }

        const findMovie: Movie = {
          title: response.Title,
          description: response.Plot,
          imgUrl:
            response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
          imdbUrl: baseMovieUrl + response.imdbID,
          imdbId: response.imdbID,
        };

        setMovie(findMovie);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    addMovie(movie);

    setQuery('');
    setMovie(null);
    setError(null);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    requestMovie();
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              onChange={event => setQuery(event.target.value)}
            />
          </div>
          {error && (
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
              disabled={Boolean(!query)}
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};

export const FindMovie = React.memo(FindMovieComponent);
