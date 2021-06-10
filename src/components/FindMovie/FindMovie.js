import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  const searchMovie = async() => {
    if (!title) {
      return;
    }

    const movieFromServer = await getMovie(title);

    if (movieFromServer.Response !== 'False') {
      setError('');

      const {
        Title: movieTitle,
        Plot: description,
        Poster: imgUrl,
        imdbID: imdbId,
      } = movieFromServer;

      setMovie({
        title: movieTitle,
        description,
        imgUrl,
        imdbUrl: `https://www.imdb.com/title/${imdbId}`,
        imdbId,
      });
    } else {
      setError(`Can&apos;t find a movie with such a title`);
    }
  };

  const setUpMovieTitle = (event) => {
    if (title) {
      clearState();
    }

    setTitle(event.target.value);
  };

  const addMovieToList = () => {
    clearState();
    if (isMovieInList()) {
      setError(`can&apos;t add, this movie is on the list`);

      return;
    }

    if (movie.title) {
      onAdd(movie);
    }
  };

  const isMovieInList = () => movies.some(curMovie => (
    curMovie.imdbId === movie.imdbId
  ));

  const clearState = () => {
    setTitle('');
    setMovie(null);
    setError('');
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
              className="input is-danger"
              value={title}
              onChange={event => setUpMovieTitle(event)}
            />
          </div>

          {error && (
            <p className="help s-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {(!error && movie) && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
};
