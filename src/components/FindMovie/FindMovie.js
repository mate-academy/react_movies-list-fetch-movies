import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';
import movies from '../../api/movies.json';
import { MovieCard } from '../MovieCard';
import { getFilm } from '../api';

export const FindMovie = ({ addNewMovie }) => {
  const [searchVal, getSearchVal] = useState([]);
  const [newMovie, setNewMovie] = useState(movies[0]);
  const [danger, setDanger] = useState(false);

  const findNewMovie = (title) => {
    getFilm(title)
      .then((movie) => {
        setDanger(true);
        if (movie.Response !== 'False') {
          setNewMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
            imdbId: movie.imdbID,
          });
          setDanger(false);
        }
      });
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
              className={cn('input', { 'is-danger': danger })}
              onChange={(e) => {
                getSearchVal(e.target.value);
              }}
            />
          </div>

          <p
            className={cn('help', { 'is-danger': danger })}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findNewMovie(searchVal)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addNewMovie(newMovie)}
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
