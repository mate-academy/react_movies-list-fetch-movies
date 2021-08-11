import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [notFound, setNotFound] = useState(false);

  const findMovie = async() => {
    const movieApi = await getMovies(title);
    // console.log(movieApi)

    if (movieApi.Response !== 'False') {
      setMovie({
        title: movieApi.Title,
        description: movieApi.Plot,
        imgUrl: movieApi.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieApi.imdbID}`,
        imdbID: movieApi.imdbID,
      });

      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const addToList = () => {
    addMovie(movie);
    setMovie(null);
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
              onChange={event => setTitle(event.target.value)}
            />
          </div>

          {notFound && (
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
              onClick={() => {
                findMovie(title);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addToList()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
