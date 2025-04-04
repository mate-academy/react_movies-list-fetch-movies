import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitBtn = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const movieFromServer = await getMovie(query.trim());

      if ('Error' in movieFromServer) {
        setHasError(true);

        return;
      }

      const newMovie = {
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
        imdbId: movieFromServer.imdbID,
      };

      setMovie(newMovie);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBtnHandler = async () => {
    if (!movie) {
      return;
    }

    setMovies((prev: Movie[]) => {
      if (prev.some(m => m.imdbId === movie.imdbId)) {
        return prev;
      }

      return [...prev, movie];
    });

    setQuery('');
    setMovie(null);
    setHasError(true);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitBtn}>
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
                'is-danger': hasError,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setHasError(false);
              }}
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
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addBtnHandler}
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
