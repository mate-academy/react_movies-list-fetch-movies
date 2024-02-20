import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [input, setInput] = useState('');
  const [errorMessage, setErrrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrrorMessage(false);
    setInput(e.target.value);
  };

  const handleAddMovieToList = (newMovie: Movie) => {
    const listIncludesNewMovie = movies
      .some(listMovie => listMovie.imdbId === newMovie.imdbId);

    if (!listIncludesNewMovie) {
      const updatedMovies = [...movies, newMovie];

      setMovies(updatedMovies);
    }

    setMovie(null);
    setInput('');
  };

  const handlefindMovie = (title: string) => {
    setLoading(true);

    getMovie(title)
      .then((response) => {
        if ('Title' in response) {
          const apiToMovie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster !== 'N/A'
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(apiToMovie);
          setErrrorMessage(false);
        } else {
          setErrrorMessage(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlefindMovie(input);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnFormSubmit}
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
              value={input}
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              onChange={handleSearchInput}
            />
          </div>

          {errorMessage && (
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
              className={cn('button is-light',
                {
                  'is-loading': loading,
                })}
              disabled={input.length === 0}
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
                onClick={() => handleAddMovieToList(movie)}
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
