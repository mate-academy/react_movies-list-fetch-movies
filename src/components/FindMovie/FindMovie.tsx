import React, { useState } from 'react';
import { getMovie } from '../api/api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const getMovieFromServer = async () => {
    const movieFromServer = await getMovie(query);

    if (movieFromServer?.Error) {
      setIsError(true);
    } else {
      setCurrentMovie(movieFromServer);
      setIsError(false);
    }

    setQuery('');
  };

  const handleMovieAdd = () => {
    if (currentMovie) {
      addMovie(currentMovie);
    }

    setQuery('');
    setCurrentMovie(null);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentMovie !== null) {
      addMovie(currentMovie);
      setQuery('');
      setCurrentMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isError ? ('input is-danger') : ('input')}
              value={query}
              onChange={handleChange}
            />
          </div>

          {isError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovieFromServer}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!currentMovie}
              onClick={handleMovieAdd}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {currentMovie !== null && (
          <MovieCard movie={currentMovie} />
        )}
      </div>
    </>
  );
};
