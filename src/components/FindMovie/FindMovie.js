import React, { useState } from 'react';
import './FindMovie.scss';

import { FindMovieTypes } from './FindMovieTypes';
import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [error, setError] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFindMovie = () => {
    setLoading(true);
    request(inputTitle)
      .then((result) => {
        setError(result === null || result.Response === 'False');
        setMovie(result.Response === 'False' ? null : result);
        setLoading(false);
      });
  };

  const addMovieToTheList = () => {
    addMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbId: movie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
    });
    setInputTitle('');
    setError(false);
  };

  const handelSubmit = event => event.preventDefault();

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handelSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={inputTitle}
              placeholder="Enter a title to search"
              className={error === true ? 'input is-danger' : 'input'}
              onFocus={() => setError(false)}
              onChange={event => setInputTitle(event.target.value)}
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!movie}
              onClick={addMovieToTheList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        { movie && (
          !loading
            ? (
              <MovieCard
                title={movie.Title}
                description={movie.Plot}
                imgUrl={movie.Poster}
                imdbUrl={`https://www.imdb.com/title/${movie.imdbID}/`}
              />
            )
            : (
              <img
                src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                alt="loading..."
              />
            ))}
      </div>
    </>
  );
};

FindMovie.propTypes = FindMovieTypes;
