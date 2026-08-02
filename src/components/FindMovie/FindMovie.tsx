import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  setMovies: (movies: Movie[]) => void;
  isError: boolean;
  setIsError: (err: boolean) => void;
  isLoading: boolean;
  setIsLoading: (el: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  isError,
  setIsError,
  isLoading,
  setIsLoading,
  setMovies,
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const getTheMovie = () => {
    getMovie(movieTitle)
      .then(data => {
        if (!data) {
          throw new Error('Film not found');
        }

        const normolizedMovie = {
          ...data,
          Poster:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
        };

        setMovie(normolizedMovie);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
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
              className={`input ${movieTitle.length === 0 && 'is-danger'}`}
              value={movieTitle}
              onChange={event => {
                setMovieTitle(event.target.value);
                setIsError(false);
              }}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={movieTitle.length === 0}
              onClick={event => {
                event.preventDefault();
                if (movieTitle.length === 0) {
                  return;
                } else {
                  // findMovie(movieTitle);
                  getTheMovie();
                }
              }}
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
                onClick={() => {
                  setMovies(prevMovies => [...prevMovies, movie]);
                  setMovie(null);
                  setMovieTitle('');
                }}
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
