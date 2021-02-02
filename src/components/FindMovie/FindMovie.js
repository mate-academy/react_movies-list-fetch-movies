import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../../data/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = (searchMovie) => {
    getMovies(searchMovie)
      .then((response) => {
        if (response.Response === 'False') {
          setMovie('');
          setIsVisible(true);

          return;
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbId: response.imdbID,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        });
        setIsVisible(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          if (isVisible) {
            setTitle('');
          }

          handleClick(title);
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
              className="input is-danger"
              value={title}
              onChange={(event) => {
                const { value } = event.target;

                setTitle(value);
              }}
            />
          </div>

          {isVisible && (
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
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
