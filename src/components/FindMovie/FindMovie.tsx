/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [availabe, setAvailabe] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setAvailabe(true);
  };

  const findMovie = async () => {
    const result = await getMovie(query);

    setMovie(result);
    setQuery('');
  };

  const addMovieHandler = () => {
    if (movie) {
      addMovie(movie);
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={query}
              onChange={handleChange}
            />
          </div>

          {availabe || (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              disabled={!query}
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                addMovieHandler();
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
