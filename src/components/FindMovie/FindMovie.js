import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, isFound, setIsFound }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setMovie] = useState(movies[0]);

  const findMovie = async() => {
    const movie = await getMovie(query);

    if (movie.Response === 'False') {
      setIsFound(false);

      return;
    }

    setMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      imdbId: movie.imdbID,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addMovie(newMovie);
    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => handleSubmit(event)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${isFound || 'is-danger'}`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsFound(true);
              }}
            />
          </div>

          {isFound || (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                findMovie();
                setMovie(null);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard {...newMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  isFound: PropTypes.bool.isRequired,
  setIsFound: PropTypes.func.isRequired,
};
