import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, SetTitle] = useState('');
  const [errorIsVisible, SetError] = useState(false);
  const [searchResult, SetResult] = useState<Movie | null>();

  const findMovie = (query: string) => {
    if (query) {
      fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=775c7ac&t=${query}`)
        .then(resp => resp.json()).then(res => {
          if (res.Response === 'False') {
            SetError(true);
          } else {
            SetResult(res);
          }
        });
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <strong>Movie title</strong>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={title}
              onChange={event => {
                SetTitle(event.target.value);
                SetError(false);
              }}
            />
          </div>
          {errorIsVisible && (
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
                SetResult(null);
                findMovie(title);
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
                if (searchResult) {
                  addMovie(searchResult);
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
        {searchResult && <MovieCard movie={searchResult} /> }
      </div>
    </>
  );
};
