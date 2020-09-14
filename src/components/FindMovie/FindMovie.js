import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from './api';
import movies from '../../api/movies.json';

export const FindMovie = ({ addNewMovie }) => {
  const [newMovie, setNewMovie] = useState(movies[0]);
  const [queryTitle, setQueryTitle] = useState('');
  const [movieNotFound, setMovieNotFound] = useState(false);

  const findMovie = async() => {
    const movie = await getMovie(queryTitle);

    if (!movie.Response || !queryTitle) {
      setMovieNotFound(true);

      return;
    }

    setNewMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      imdbId: movie.imdbID,
    });
  };

  useEffect(() => {
    setMovieNotFound(false);
  }, [queryTitle]);

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
              className={ClassNames('input', {
                'is-danger': movieNotFound,
              })}
              onChange={event => setQueryTitle(event.target.value)}
              value={queryTitle}
              autoComplete="off"
            />
          </div>

          {movieNotFound && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addNewMovie(newMovie);
                setQueryTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...newMovie} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
