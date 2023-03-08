import React, { Dispatch, SetStateAction, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { normalizeMovieData } from '../utils/normalizeMovieData';

type Props = {
  addMovie: Dispatch<SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMovieExist, setIsMovieExist] = useState(false);

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
    setMovie(null);
    setIsMovieExist(false);
  };

  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const fetchMovie = await getMovie(query);

      if ((fetchMovie as MovieData).imdbID) {
        setMovie(normalizeMovieData(fetchMovie as MovieData));
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = (newMovie: Movie) => {
    addMovie(prevMovies => {
      if (prevMovies.some(
        current => current.imdbId === newMovie.imdbId,
      )) {
        setIsMovieExist(true);

        return prevMovies;
      }

      return [...prevMovies, newMovie];
    });

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmitForm}
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
                'is-danger': isError,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title!
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
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
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
