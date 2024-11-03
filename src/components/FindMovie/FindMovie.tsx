import cn from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { useLoading } from '../../hooks/useLoading';

type Props = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [searchMovies, setSearchMovies] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim() === '') {
      setHasError(true);

      return;
    }

    startLoading();
    getMovie(query.trim())
      .then(result => {
        if ('Error' in result) {
          setHasError(true);
        } else {
          const { Poster, Title, Plot, imdbID } = result;
          const movie: Movie | null = {
            title: Title,
            description: Plot,
            imgUrl:
              Poster && Poster !== 'N/A'
                ? Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setSearchMovies(movie);
        }
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        stopLoading();
      });
    setQuery('');
  };

  const addMovie = () => {
    if (searchMovies !== null) {
      const filteredMovie = movies.find(
        movie => movie.imdbId === searchMovies.imdbId,
      );

      if (!filteredMovie) {
        setMovies([...movies, searchMovies]);
      }
    }

    setSearchMovies(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={handleChangeInput}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': query.trim() === ' ',
              })}
            />
          </div>

          {hasError && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {searchMovies && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {searchMovies && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchMovies} />
        </div>
      )}
    </>
  );
};
