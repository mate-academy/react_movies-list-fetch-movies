import React, { useState } from 'react';
import './FindMovie.scss';

import { PropTypes } from 'prop-types';
import { MovieType } from '../types';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, setMovie] = useState('');
  const [wrongTitle, showWarning] = useState(false);
  const [movie, showMovie] = useState({});

  const isFoundMovie = !!Object.keys(movie).length;

  const getMovieFromServer = async() => {
    const movieData = await getMovie(movieTitle);

    if (movieData.Response === 'False') {
      showWarning(true);

      return;
    }

    const imageUrl = movieData.Poster;
    const foundMovie = {
      imdbId: movieData.imdbID,
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: imageUrl && imageUrl !== 'N/A' ? imageUrl : '',
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    };

    showWarning(false);
    showMovie(foundMovie);
  };

  const addMovieToList = () => {
    if (isFoundMovie) {
      addMovie(movie);
      setMovie('');
      showMovie({});
    }
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
              className={wrongTitle ? 'input is-danger' : 'input'}
              value={movieTitle}
              onChange={(e) => {
                setMovie(e.target.value);
              }}
            />
          </div>

          {wrongTitle && (
            <p className="help">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovieFromServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {isFoundMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.defaultProps = {
  movies: [],
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape(MovieType)),
  addMovie: PropTypes.func.isRequired,
};
