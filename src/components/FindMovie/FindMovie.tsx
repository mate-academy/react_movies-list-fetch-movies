import React, { useState } from 'react';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movies: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState(false);
  const [isloading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getMovie(title)
      .then(data => {
        if (data.Response === 'True') {
          setMovie(data);
          setTitle('');
        } else {
          setError(true);
        }

        setLoading(false);
      });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(false);
                }}
              />
            </div>
          </label>

          <p className="help is-danger">
            {error && ('Can\'t find a movie with such a title')}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              disabled={title === ''}
              onClick={load}
            >
              {isloading
                ? (
                  <img
                    src="images/Spinner-3.gif"
                    width="30px"
                    height="30px"
                    alt="loading"
                  />
                )
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={movie === undefined}
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setMovie(undefined);
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
