import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import cn from 'classnames';

type Props = {
  setMovies: (m: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFindMovie = (event: React.FormEvent) => {
    event.preventDefault();

    if (query) {
      setLoading(true);
    }

    getMovie(query)
      .then(movieFind => {
        if ('Error' in movieFind) {
          setError(true);

          return;
        }

        setMovie(() => {
          const normalizedMovie = {
            title: movieFind.Title,
            description: movieFind.Plot,
            imgUrl: movieFind.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieFind.imdbID}`,
            imdbId: movieFind.imdbID,
          };

          return normalizedMovie;
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onAddMovie = () => {
    if (movie) {
      setMovies(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className={cn('find-movie', {
          'is-loading': loading,
        })}
        onSubmit={e => handleFindMovie(e)}
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
              className="input is-danger"
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setError(false);
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
              className={cn(`button is-light`, {
                'is-loading': loading,
              })}
              disabled={query.length === 0}
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
                onClick={onAddMovie}
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
