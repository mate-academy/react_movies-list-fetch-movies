import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import propTypes from 'prop-types';
// import Loader from 'react-loader-spinner';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [foundMovie, setFoundMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const searchMovie = () => {
    getMovie(title)
      .then((movie) => {
        setFoundMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbId}`,
          imdbId: movie.imdbID,
        });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movies.some(movie => movie.imdbId === foundMovie.imdbId)) {
      addMovie(foundMovie);
      setFoundMovie(null);
      setTitle('');
    } else {
      setError('The movie is already on the list');
    }
  };

  const handleChange = (event) => {
    if (event.target.value !== title) {
      setError(null);
    }

    setTitle(event.target.value);
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
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

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!foundMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie && (
          <MovieCard {...foundMovie} />
        )
          // : (
          //   <div className="loader">
          //     <Loader
          //       type="Circles"
          //       color="purple"
          //       height={120}
          //       width={120}
          //       timeout={3000}
          //     />
          //   </div>
          // )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: propTypes.func.isRequired,
  movies: propTypes.arrayOf(propTypes.shape({
    title: propTypes.string.isRequired,
    description: propTypes.string.isRequired,
    imgUrl: propTypes.string.isRequired,
    imdbUrl: propTypes.string.isRequired,
  }).isRequired).isRequired,
};
