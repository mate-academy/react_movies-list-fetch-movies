/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { getMovieByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie?: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie>();
  const [warn, setWarn] = useState<boolean>(false);

  async function getMovie() {
    const response = await getMovieByTitle(query);

    if (response.Response === 'True') {
      setMovie(response);
    } else {
      setWarn(true);
    }
  }

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
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {warn && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => onAdd(movie)}
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
