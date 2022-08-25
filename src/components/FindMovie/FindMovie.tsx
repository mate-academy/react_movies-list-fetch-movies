import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  updateMovies: CallableFunction;
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ updateMovies, movies }) => {
  const [currMovie, setCurrMovie] = useState<Movie | null>(null);
  const [inputText, setInputText] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const normalizeMovie = (movie: MovieData) => {
    const normalizedMovie: Movie = {
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      imdbId: movie.imdbID,
    };

    setCurrMovie(normalizedMovie);
  };

  const submitHandle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrMovie(null);
    setIsLoading(true);

    getMovie(inputText)
      .then(movie => {
        if (Object.prototype.hasOwnProperty.call(movie, 'Error')) {
          setIsError(true);
        } else {
          normalizeMovie(movie as MovieData);
        }
      })
      .catch(() => (setIsLoading(false)))
      .finally(() => (setIsLoading(false)));
  };

  const handleAddBtn = () => {
    if (!movies.some(movie => movie.imdbId === currMovie?.imdbId)) {
      updateMovies([...movies, currMovie]);
    }

    setCurrMovie(null);
    setInputText('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitHandle}
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
              className="input is-dander"
              value={inputText}
              onChange={(event) => {
                setInputText(event.target.value);
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!inputText}
            >
              Find a movie
            </button>
          </div>
          {currMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddBtn}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {currMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currMovie} />
        </div>
      )}
    </>
  );
};
