import React, { useState } from 'react';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState({});
  const [query, setQuery] = useState('');

  const findMovie = async () => {
    const movieFromServer = await getMovie(query);
    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: movieFromServer.imdbID,
    })
  }

  const handleChange = (event) => {
    setQuery(event.target.value);
  }

  return (
  <>
    <form className="find-movie">
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            onChange={handleChange}
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            className="input "
          />
        </div>

        {/* <p className="help is-danger">
          Can&apos;t find a movie with such a title
        </p> */}
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
            onClick={() => addMovie(movie)}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

    <div className="container">
      <h2 className="title">Preview</h2>
      <MovieCard {...movie} />
    </div>
  </>
  )
};
