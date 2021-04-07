import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ setMovies }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const handleFindMovie = async() => {
    const foundMovie = await request(title);

    if (foundMovie.Title) {
      setMovie({
        title: foundMovie.Title,
        description: foundMovie.Plot,
        imdbId: foundMovie.imdbID,
        imgUrl: foundMovie.Poster,
        imdbUrl: foundMovie.imdbID,
      });
    } else {
      setError(true);
    }
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setError(false);
  };

  const setMovieToList = () => {
    setMovies((movies) => {
      if (!movies.find(mov => mov.imdbId === movie.imdbId)) {
        return [...movies, movie];
      }

      return movies;
    });

    setTitle('');
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
              value={title}
              onChange={handleChangeTitle}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
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
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={setMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard
            title={movie.title}
            description={movie.description}
            imgUrl={movie.imgUrl}
            imdbUrl={movie.imdbUrl}
          />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
};
