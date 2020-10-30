import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ setMovies, listMovies }) => {
  const BASE_URL = 'http://www.omdbapi.com/?apikey=317f0705';
  const [query, setQuery] = useState('');
  const [movieForPreview, setMovie] = useState(null);

  const [visibleError, setVisibleError] = useState(false);
  const request = title => fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json())
    .then((result) => {
      const previewMovies = {};

      Object.keys(result).forEach((key) => {
        switch (key) {
          case 'Title':
            previewMovies.title = result[key];
            break;
          case 'Plot':
            previewMovies.description = result[key];
            break;
          case 'Poster':
            previewMovies.imgUrl = result[key];
            break;
          case 'imdbID':
            previewMovies.imdbUrl
            = `https://www.imdb.com/title/${result[key]}/`;
            previewMovies.imdbId = result[key];
            break;
          default: break;
        }
      });

      if (Object.keys(previewMovies).length > 0) {
        setMovie(previewMovies);
        setVisibleError(false);
      } else {
        setVisibleError(true);
      }
    });

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
              className={classnames('input', { 'is-danger': visibleError })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>
          {visibleError ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) : ''}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                request(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                // eslint-disable-next-line react/prop-types
                if (
                  movieForPreview !== null && !listMovies
                    .some(movie => movie.imdbId === movieForPreview.imdbId)) {
                  setMovies([...listMovies, movieForPreview]);
                  setQuery('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movieForPreview !== null ? (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movieForPreview} />
          </>
        ) : ''
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
  listMovies: PropTypes.arrayOf(PropTypes.object).isRequired,
};
