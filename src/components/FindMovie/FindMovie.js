import React, { useState } from 'react';
import './FindMovie.scss';

import cn from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/api';

export const FindMovie = ({ addMovie, addedMovies }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState({});
  const [errorMessage, seterrorMessage] = useState('');

  const searchMovie = () => {
    getMovies(search)
      .then((foundMovie) => {
        if (foundMovie.Response === 'False') {
          seterrorMessage('Can\'t find a movie with such a title');

          return;
        }

        const newMovie = {
          title: foundMovie.Title,
          description: foundMovie.Plot,
          imgUrl: foundMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
        };

        setMovie(newMovie);
        seterrorMessage('');
      });
  };

  const addMovieToList = () => {
    if (addedMovies
      .filter(addedMovie => addedMovie.imdbId === movie.imdbID).length === 0) {
      addMovie(movie);
      seterrorMessage('');
      setSearch('');
      setMovie({});
    } else {
      seterrorMessage('This movie has been already added');
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
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
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

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={Object.keys(movie).length === 0}
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {Object.keys(movie).length !== 0 && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            title={movie.title}
            description={movie.description}
            imgUrl={movie.imgUrl}
            imdbUrl={movie.imdbUrl}
          />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  addedMovies: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};
