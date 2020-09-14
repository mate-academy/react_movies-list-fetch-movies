import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getFilm } from '../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

export const FindMovie = ({ newMovies }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(movies[0]);
  const [filmIsExist, setMovieExist] = useState(true);

  const findExistMovie = () => {
    const titleToLow = title.toLowerCase();
    const moviesFromData = movies.find(movie => movie
      .title.toLowerCase() === titleToLow);

    if (moviesFromData) {
      setPreview(moviesFromData);
    }

    getFilm(title)
      .then((movie) => {
        if (movie.Response === 'False') {
          setMovieExist(false);
        } else {
          const moviesFromServer = {
            title: movie.Title,
            description: movie.Plot,
            imdbId: movie.imdbID,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          };

          setPreview(moviesFromServer);
        }
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setTitle('');
          setPreview([movies[0]]);
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
              className={filmIsExist ? 'input' : 'input is-danger'}
              value={title}
              onChange={event => setTitle(event.target.value)
              }
            />
          </div>
          { filmIsExist || (
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
              onClick={() => findExistMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => newMovies(preview)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...preview} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  newMovies: PropTypes.func.isRequired,
};
