import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { request } from '../api';

import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: (movie: Movie) => void
  movies: Movie[]
}

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [inputValue, setinputValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [findMovie, setFindMovie] = useState<Movie>();

  useEffect(() => {
    request(inputValue)
      .then(movie => {
        if (Object.keys(movie).length > 3) {
          setFindMovie(movie);
        } else {
          setFindMovie(undefined);
        }
      });
    setVisible(false);
  }, [inputValue]);

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
              className={`input ${findMovie === undefined && visible && 'is-danger'}`}
              value={inputValue}
              onChange={(event) => setinputValue(event.target.value)}
            />
          </div>
          {visible && findMovie === undefined && (
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
              onClick={() => setVisible(true)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (!movies.some(movie => movie.imdbID === findMovie?.imdbID)
                  && findMovie !== undefined) {
                  setMovies(findMovie);
                }

                setinputValue('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {findMovie && visible === true && (
          <MovieCard
            movie={findMovie}
          />
        )}
      </div>
    </>
  );
};
