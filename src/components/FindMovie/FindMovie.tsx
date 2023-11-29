import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const findMovie = (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue) {
      setError(true);

      return;
    }

    setIsLoading(true);

    getMovie(inputValue)
      .then((data) => {
        if (Object.hasOwnProperty.call(data, 'Error')) {
          throw new Error('Movie not found');
        }

        const movieData = data as MovieData;

        const foundMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imdbId: movieData.imdbID,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imgUrl: movieData.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieData.Poster,
        };

        setMovie(foundMovie);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addMovieButtonHandler = () => {
    if (movie) {
      if (movies.every((item) => item.imdbId !== movie.imdbId)) {
        setMovies((prevMovies) => [...prevMovies, movie]);
      }

      setMovie(null);
      setInputValue('');
    }
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setInputValue(event.target.value);
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
              value={inputValue}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': error })}
              onFocus={() => setError(false)}
              onChange={inputChangeHandler}
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              onClick={findMovie}
              disabled={inputValue === ''}
            >
              Find a movie
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieButtonHandler}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
