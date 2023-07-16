import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<MovieData | null>(null);
  const [firstSearch, setFirstSearch] = useState(false);

  const defaultPicture
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const prepareMovie = (movie: MovieData) => {
    const {
      Poster,
      Title,
      Plot,
      imdbID,
    } = movie;

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster || defaultPicture,
      imdbId: imdbID,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    };
  };

  const addMovie = () => {
    if (movies.find(movie => movie.imdbId === foundMovie?.imdbID)) {
      setQuery('');
      setFoundMovie(null);

      return;
    }

    setMovies(prepareMovie(foundMovie as MovieData));
    setFirstSearch(false);
    setQuery('');
    setFoundMovie(null);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleFormSubmit = useCallback(async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await getMovie(query);

      if ('Response' in response && response.Response === 'False') {
        setHasError(true);
        setFoundMovie(null);
      } else {
        setHasError(false);
        setFoundMovie(response as MovieData);
        setFirstSearch(true);
      }
    } catch (error) {
      setHasError(true);
      setFoundMovie(null);
      setFirstSearch(false);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={cn(
                'input',
                {
                  'is-danger': hasError,
                },
              )}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {hasError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          {firstSearch
            ? (
              <div className="control">
                <button
                  data-cy="searchButton"
                  type="submit"
                  className={cn(
                    'button is-light',
                    {
                      'is-loading': isLoading,
                    },
                  )}
                  disabled={!query}
                >
                  Search again
                </button>
              </div>
            ) : (
              <div className="control">
                <button
                  data-cy="searchButton"
                  type="submit"
                  className={cn(
                    'button is-light',
                    {
                      'is-loading': isLoading,
                    },
                  )}
                  disabled={!query}
                >
                  Find a movie
                </button>
              </div>
            )}

          <div className="control">
            {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={prepareMovie(foundMovie)} />
        </div>
      )}
    </>
  );
};
