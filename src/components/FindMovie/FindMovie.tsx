import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';
import { Movie } from '../../types/Movie';

type FindMovieProps = {
  setAddedMovies: (addedMovies: Movie[]) => void;
  addedMovies: Movie[];
};

export const FindMovie: React.FC<FindMovieProps> = ({
  setAddedMovies,
  addedMovies,
}) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleOnClickSearchMovie = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!query) {
      return;
    }

    setIsLoading(true);
    getMovie(query)
      .then(movie => {
        if ('Error' in movie) {
          setIsError(true);
        } else {
          setFoundMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl:
              movie.Poster && movie.Poster !== 'N/A'
                ? movie.Poster
                : `https://via.placeholder.com/360x270.png?text=no%20preview`,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
          setIsError(false);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovies = () => {
    if (foundMovie !== null) {
      let isAlreadyExist = false;

      for (const movie of addedMovies) {
        if (movie.imdbId === foundMovie.imdbId) {
          isAlreadyExist = true;
          break;
        }
      }

      if (!isAlreadyExist) {
        setAddedMovies([...addedMovies, foundMovie]);
      }

      setFoundMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie">
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
              className={cn('input', { 'is-danger': isError })}
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
              className={cn('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={!query}
              onClick={handleOnClickSearchMovie}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovies}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
