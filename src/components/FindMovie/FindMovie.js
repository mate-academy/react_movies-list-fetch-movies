import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { getMovieByTitle } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addNewMovie }) => {
  const [movie, setMovie] = useState(null);
  const [queryTitle, setTitle] = useState('');
  const [isMovieFound, setStatusMovie] = useState(false);

  const handleChangeQuery = (event) => {
    const { value } = event.target;

    setTitle(value);
  };

  const showFoundMovie = async() => {
    setStatusMovie(false);
    const foundMovie = await getMovieByTitle(queryTitle);

    if (foundMovie.Response === 'False') {
      setStatusMovie(true);
      setTitle('');
      setMovie(null);
    } else if (foundMovie.Response === 'True') {
      setMovie({
        title: foundMovie.Title,
        description: foundMovie.Plot,
        imgUrl: foundMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
        imdbId: foundMovie.imdbID,
      });
    }

    setTitle('');
  };

  const addMovie = () => {
    addNewMovie(movie);
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
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
              className={cn({
                input: true,
                'is-danger': isMovieFound,
              })}
              value={queryTitle}
              onChange={handleChangeQuery}
            />
          </div>

          {isMovieFound && (
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
              onClick={showFoundMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie !== null && (
          <MovieCard
            title={movie.title}
            description={movie.description}
            imgUrl={movie.imgUrl}
            imdbUrl={movie.imdbUrl}
            imdbId={movie.imdbId}
          />
        )
        }

      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
