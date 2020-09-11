import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ movies, addMovie }) => {
  const [titleQuery, setTitleQuery] = useState('');
  const [preview, setPreview] = useState(movies[0]);
  const [isMovieExists, setMovieExistance] = useState(true);

  const findMovie = () => {
    const queryToLow = titleQuery.toLowerCase();
    const movieFromData = movies
      .find(movie => movie.title.toLowerCase() === queryToLow);

    if (movieFromData) {
      setPreview(movieFromData);
    } else {
      getMovie(titleQuery)
        .then((movie) => {
          if (movie.Response === 'False') {
            setMovieExistance(false);
          } else {
            const movieFromServer = {
              title: movie.Title,
              imdbId: movie.imdbID,
              imgUrl: movie.Poster,
              imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
              description: movie.Plot,
            };

            setPreview(movieFromServer);
          }
        });
    }
  };

  const handleChanges = (event) => {
    setTitleQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPreview(movies[0]);
    setTitleQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={isMovieExists ? 'input' : 'input is-danger'}
              value={titleQuery}
              onChange={handleChanges}
            />
          </div>

          {isMovieExists || (
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
              onClick={() => findMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={() => addMovie(preview)}
              disabled={
                !isMovieExists
                || titleQuery === ''
              }
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...preview} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  addMovie: PropTypes.func.isRequired,
};
