import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { request } from '../../helpers';

export const FindMovie = ({ movies, setMovies }) => {
  const [newMovie, setNewMovie] = useState(null);
  const [error, setError] = useState('');
  const [movieTitle, setMovieTitle] = useState('');

  const handleChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const findFilm = (title) => {
    request(title)
      .then((result) => {
        if (result.Response === 'True') {
          setError('');
          setNewMovie({
            title: result.Title,
            description: result.Plot,
            imgUrl: result.Poster,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            imdbId: result.imdbID,
          });
        }

        if (result.Response === 'False') {
          setNewMovie(null);
          setError(result.Error);
        }
      });
  };

  const handleAddMovies = (movie) => {
    if (movies.find(item => item.imdbId === movie.imdbId)) {
      setError(`Movie "${movie.title}" has already been added`);
    } else {
      setMovies([...movies, movie]);
      setMovieTitle('');
    }
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
              className={classNames(
                'input',
                { 'is-danger': error },
              )}
              value={movieTitle}
              onChange={event => handleChange(event)}
            />
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findFilm(movieTitle)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!newMovie}
              onClick={() => handleAddMovies(newMovie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMovies: PropTypes.func.isRequired,
};
