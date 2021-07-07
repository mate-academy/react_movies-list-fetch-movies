import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';
import { getMovieInfo } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movieInfo, setMovieInfo] = useState({});
  const [titleError, setTitleError] = useState(false);
  const [titleSearched, setTitleSearched] = useState('');

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
              className="input is-danger"
              value={titleSearched}
              onChange={(event) => {
                setTitleSearched(event.target.value);
                setTitleError(false);
              }}
            />
          </div>
          {titleError && (
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
              onClick={() => {
                setMovieInfo({});
                getMovieInfo(titleSearched)
                  .then((data) => {
                    setMovieInfo(data);
                    if (!data.Title) {
                      setTitleError(true);
                    }
                  });
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
                addMovie(movieInfo);
                setTitleSearched('');
                setTitleError(false);
                setMovieInfo({});
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {
        movieInfo.Title && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard
              title={movieInfo.Title}
              description={movieInfo.Plot}
              imgUrl={movieInfo.Poster}
              imdbUrl={`https://www.imdb.com/title/${movieInfo.imdbID}`}
            />
          </div>
        )
      }
    </>
  );
};
