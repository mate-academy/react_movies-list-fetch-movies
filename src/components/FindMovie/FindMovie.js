import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [movieWasNotFound, setMovieStatus] = useState(false);

  const handleChange = (handleEvent) => {
    const { value } = handleEvent.target;

    setMovieStatus(false);
    setQuery(value);
  };

  const findMovie = async() => {
    const newMovie = await request(query);

    if (newMovie.Response === 'False') {
      setMovieStatus(true);
    } else {
      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imdbId: newMovie.imdbID,
        imgUrl: newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
      });

      setMovieStatus(false);
    }
  };

  const handleSubmit = (clickEvent) => {
    clickEvent.preventDefault();

    findMovie();
  };

  const addNewMovie = () => {
    if (!movieWasNotFound && movie) {
      onAddMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              onChange={handleChange}
            />
          </div>

          {movieWasNotFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
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
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!movieWasNotFound && movie && (
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
  onAddMovie: PropTypes.func.isRequired,
};
