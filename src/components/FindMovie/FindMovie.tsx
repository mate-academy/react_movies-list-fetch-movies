import React, { useState, useEffect, FormEventHandler } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { DEFAULT_IMG } from './FindMovie.constants';

interface Props {
  onMovieAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = React.memo(({ onMovieAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setError(null);
    }
  }, [query]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setError(data.Error);
          setMovie(null);
        } else {
          const poster = data.Poster === 'N/A'
            ? DEFAULT_IMG
            : data.Poster;

          const newMovie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(newMovie);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      onMovieAdd(movie);
      setMovie(null);
      setQuery('');
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(null);
              }}
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
              className={classNames('button', 'is-link', {
                'is-loading': isLoading,
              })}
              disabled={!query}
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
                disabled={!movie}
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
});
