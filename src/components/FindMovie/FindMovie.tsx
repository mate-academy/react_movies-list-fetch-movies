import React, { useState } from 'react';
// eslint-disable-next-line import/extensions
import { searchMovies } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (arg: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [input, setInput] = useState('');
  const [err, seterr] = useState(false);

  const getMovies = (title: string) => {
    searchMovies(title)
      .then((res: React.SetStateAction<Movie | null>) => setMovie(res))
      .catch(() => {
        seterr(true);
      });
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
              className={`input ${err && 'is-danger'}`}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              value={input}

            />
          </div>

          {err && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="find"
              type="button"
              className="button is-light"
              onClick={() => {
                getMovies(input);
              }}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              disabled={err}
              data-cy="add"
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setMovie(null);
                  setInput('');
                }
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
