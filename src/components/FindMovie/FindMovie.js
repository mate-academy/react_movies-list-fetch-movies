import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, setMovies }) => {
  const [inputText, setInputText] = useState('');
  const [movie, setMovie] = useState(null);
  const [isMovieFound, setMovieState] = useState(false);

  const handleChange = (changeEvent) => {
    setMovieState(false);
    setInputText(changeEvent.target.value);
  };

  const searchMovie = (movieEvent) => {
    movieEvent.preventDefault();
    getMovie(inputText)
      .then((response) => {
        try {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imdbId: response.imdbID,
            imgUrl: response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          });
          setMovieState(false);
        } catch {
          setMovieState(true);
        }
      });
  };

  const addMovie = () => {
    if (!movies.find(film => film.imdbId === movie.imdbId)
      && !isMovieFound
      && movie
    ) {
      setMovies([...movies, movie]);
      setMovie(null);
      setInputText('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={searchMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={inputText}
              onChange={handleChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={isMovieFound ? 'input is-danger' : 'input'}
            />
          </div>

          {isMovieFound
            && (
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
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!isMovieFound && movie
          && (
            <MovieCard {...movie} />
          )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  setMovies: PropTypes.func.isRequired,
};
