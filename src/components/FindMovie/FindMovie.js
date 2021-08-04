import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

export const FindMovie = ({ addMovie }) => {
  const BASE_URL = 'https://www.omdbapi.com/?apikey=2dfeee8&t=';
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({});
  const [moviesList, addNewMovie] = useState(movies);
  const [wasAdd, showMessage] = useState(false);

  const getMovie = () => fetch(BASE_URL + title.toLowerCase())
    .then(response => response.json())
    .then(response => setMovie(response));

  const findMovie = (event) => {
    const { value } = event.target;

    setTitle(value);
    movie.Response = '';
  };

  const addMovieToList = () => {
    const listOfImdbId = Object.values(moviesList.map(item => item.imdbId));

    if (!listOfImdbId.includes(movie.imdbID)) {
      addMovie(newMovie);
      addNewMovie([...moviesList, newMovie]);
      setTitle('');
      setMovie({});
      showMessage(false);
    } else {
      showMessage(true);
    }
  };

  const {
    Title,
    Poster,
    imdbID,
    Plot,
  } = movie;

  const newMovie = {
    title: Title,
    description: Plot,
    imdbId: imdbID,
    imgUrl: Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMovie();
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
              className={
                classNames('input', { 'is-danger': movie.Response === 'False' })
              }
              value={title}
              onChange={event => findMovie(event)}
              autoComplete="off"
            />
          </div>
          {movie.Response === 'False'
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
            : null
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovieToList()}
              disabled={!Object.prototype.hasOwnProperty.call(movie, 'Title')}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {
          wasAdd
            ? (
              <p className="help is-danger">
                This movie has already been added to the list
              </p>
            ) : null
        }
        {movie.Title
          ? (
            <>
              <h2 className="title">Preview</h2>
              <MovieCard {...newMovie} />
            </>
          ) : null
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
