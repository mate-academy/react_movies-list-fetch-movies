/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  callback: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ callback }) => {
  const film = {
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  };

  const [title, setValue] = useState('');
  const [movie, setMovie] = useState(film);
  const [errorMessage, setError] = useState('');

  const getData = async () => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=9f56fe16&t=${title}`);
      const movieOb = await response.json();

      if (movieOb.Error) {
        throw new Error('err');
      }

      setMovie(movieOb);
    } catch (error) {
      setMovie(film);
      setError('Can\'t find a movie with such a title');
    }
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
                className={classnames('input', { 'is-danger': errorMessage })}
                value={title}
                onChange={(event) => {
                  setValue(event.target.value);
                  setError('');
                }}
              />
            </div>
          </label>
        </div>

        {errorMessage}

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getData}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie.Title) {
                  callback(movie);
                  setValue('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie.Title && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
