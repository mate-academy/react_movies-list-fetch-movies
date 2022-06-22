/* eslint-disable no-console */
import React, { useState } from 'react';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';

import './FindMovie.scss';
import { getMovie } from '../../api/api';

interface Props {
  addMove: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addMove }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>({
    Response: '',
    Title: 'not found',
    Poster: 'not found',
    imdbID: 'not found',
  });

  const serchMovie = () => {
    getMovie(query).then((result) => {
      console.log(result);

      setMovie(result);
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
              value={query}
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(event) => {
                setQuery(event.target.value);
                console.log(query);
              }}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={serchMovie}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={() => {
                addMove(movie);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie.Response === 'True'
          && (
            <>
              <h2 className="title">Preview</h2>
              <MovieCard
                id={movie.imdbID}
                movie={movie}
              />
            </>
          )}
        {movie.Response === 'False'
          && (
            <p>Try another tittle</p>
          )}
      </div>
    </>
  );
};
