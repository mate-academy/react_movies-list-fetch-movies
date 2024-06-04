import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [fetchError, setFetchError] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const movieWasFound = !fetchError && !isLoading && movie;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFetchError(false);
    setQuery(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    const fetchMovie = async (movieTitle: string) => {
      setFetchError(false);
      setIsLoading(true);

      try {
        const response = await getMovie(movieTitle);

        if ('Error' in response) {
          setMovie(null);
          setFetchError(true);
        } else {
          const normalizedMovie: Movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster !== 'N/A'
                ? response.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(normalizedMovie);
        }
      } catch (error) {
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie(query);
  };

  const handleAddMovie = (newMovie: Movie) => {
    const movieInTheList = movies.some(film => film.imdbId === newMovie.imdbId);

    if (movieInTheList) {
      setMovie(null);
      setQuery('');

      return;
    }

    setMovies([...movies, newMovie]);
    setMovie(null);
    setQuery('');
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': fetchError,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {fetchError && (
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

          <div className="control">
            {movieWasFound && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movieWasFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
