import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [valid, setValid] = useState(true);

  const findMovie = async () => {
    const newMowie = await getMovie(query);

    if (newMowie.Response === 'False') {
      setValid(false);
      setMovie(null);

      return;
    }

    setMovie(newMowie);
    setQuery('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setValid(true);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">

          <div className="control">
            <label className="label" htmlFor="movie-title">
              Movie title
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn('input', { 'is-danger': !valid })}
                value={query}
                onChange={handleChange}
              />
            </label>
          </div>

          {valid || (
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
                addMovie(movie as Movie);
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
