import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setHasError(false);

    try {
      const newMovie = await getMovie(query.trim());

      if ('Error' in newMovie) {
        setHasError(true);
      } else {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = newMovie;

        // eslint-disable-next-line max-len
        const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';
        const imgUrl = Poster !== 'N/A'
          ? Poster
          : defaultPicture;

        const imdbUrl = `https://www.imdb.com/title/${imdbID}`;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl,
          imdbUrl,
          imdbId: imdbID,
        });
      }
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = useCallback(() => {
    setQuery('');
    setMovie(null);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const addMovie = useCallback(() => {
    const isNotNewMovie = movies
      .some(prevMovie => prevMovie.imdbId === movie?.imdbId);

    if (isNotNewMovie) {
      clearForm();
    }

    if (!isNotNewMovie && movie) {
      setMovies([
        ...movies,
        movie,
      ]);
    }

    clearForm();
  }, [movie, movies]);

  const handleQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setHasError(false);
    }, [query],
  );

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
              className="input is-dander"
              value={query}
              onChange={handleQuery}
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
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
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
