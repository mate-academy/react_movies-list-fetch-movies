import React, { useState, SetStateAction, Dispatch } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { defaultMovie } from '../../utils/defaultMovie';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: Dispatch<SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isMovieExist, setIsMovieExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleError, setIsTitleError] = useState(false);

  const handleFind = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const loadMovie = await getMovie(query);

      if ((loadMovie as MovieData).imdbID) {
        setMovie(defaultMovie(loadMovie as MovieData));
      } else {
        setIsTitleError(true);
      }
    } catch (error) {
      setIsTitleError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsTitleError(false);
    setMovie(null);
    setIsMovieExist(false);
  };

  const handleAddMovie = (newMovie: Movie) => {
    addMovie(prev => {
      if (prev.some(
        cur => cur.imdbId === newMovie.imdbId,
      )) {
        setIsMovieExist(true);

        return prev;
      }

      return [...prev, newMovie];
    });
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFind}
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
                'is-danger': isTitleError,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isTitleError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {isMovieExist && (
            <p className="help is-danger">
              This movie is already on the list!
            </p>
          )}

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div
          className="container"
          data-cy="previewContainer"
        >
          <h2 className="title">
            Preview
          </h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
