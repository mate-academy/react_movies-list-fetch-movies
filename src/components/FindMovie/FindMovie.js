import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  // eslint-disable-next-line
  let [movie, setMovie] = useState([]);
  // eslint-disable-next-line
  let [title, setTitle] = useState('');
  // eslint-disable-next-line
  let [error, setError] = useState('');

  const searchMovie = (movieTitle) => {
    getMovie(movieTitle)
      .then((result) => {
        if (result.Response === 'False') {
          setError(error = result.Response);

          return;
        }

        setMovie({
          title: result.Title,
          description: result.Plot,
          imgUrl: result.Poster,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        });
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          if (title !== '' || (error !== 'False' && movie === [])) {
            addMovie(movie);
            setTitle(title = '');
            setMovie(movie = []);
          }
        }}
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
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(error = '');
              }
              }
              className={`input ${error && 'is-danger'}`}
            />
          </div>

          {error === 'False' && (
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
              onClick={() => searchMovie(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {(movie.length === 0 || error === 'False') || (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
