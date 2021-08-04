import React, { useState } from 'react';
import './FindMovie.scss';
// import classNames from 'classnames';
import movies from '../../api/movies.json';
import { loadMovie } from '../../api/loader';

import { MovieCard } from '../MovieCard';

export const FindMovie = () => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const handleChange = event => setTitle(event.target.value);

  const getMovie = async() => {
    const movieFromServer = await loadMovie(title);
    const movieToAdd = {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    };

    setMovie(movieToAdd);
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
              onChange={handleChange}
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...movie || { ...movies[0] }} />
      </div>
    </>
  );
};
