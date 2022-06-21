/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (theMovie: Movie) => void
  ifMovieAdded: Movie[]
};

export const FindMovie: React.FC <Props> = ({ onAdd, ifMovieAdded }) => {
  const urlMovies = 'https://www.omdbapi.com/?apikey=848ed1e8&';

  const [theMovie, setTheMovie] = useState <Movie>({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [inputedMovie, setInputedMovie] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [added, setAdded] = useState(false);

  const findMovie = () => {
    fetch(`${urlMovies}t=${inputedMovie}`)
      .then(response => {
        response.json()
          .then(movie => {
            if (movie.Response !== 'False') {
              setTheMovie(movie);
            } else {
              setErrorMessage('Movie not found!!!');
            }
          });
      });
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
              value={inputedMovie}
              className={errorMessage ? 'input is-danger' : 'input'}
              onChange={(event) => {
                setInputedMovie(event.target.value);
                setErrorMessage('');
                setAdded(false);
              }}
            />
          </div>

          {errorMessage ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )
            : (
              ''
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={() => {
                if (inputedMovie) {
                  findMovie();
                } else {
                  setErrorMessage('movie not found');
                }
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={() => {
                if (theMovie.imdbID !== '') {
                  if (ifMovieAdded.some((movie) => {
                    return movie.imdbID === theMovie.imdbID;
                  })) {
                    setAdded(true);
                  }

                  onAdd(theMovie);
                  setInputedMovie('');
                  setTheMovie({
                    Poster: '',
                    Title: '',
                    Plot: '',
                    imdbID: '',
                  });
                } else {
                  setErrorMessage('Movie not fouund!');
                }
              }}
            >
              Add to the list
            </button>

            {added && (
              <p className="help is-danger">
                Movie has been added
              </p>
            )}
          </div>
          <div
            className="control"
          >
            <button
              type="button"
              className="button is-danger"
              onClick={() => {
                setInputedMovie('');
                setTheMovie({
                  Poster: '',
                  Title: '',
                  Plot: '',
                  imdbID: '',
                });
                setErrorMessage('');
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {errorMessage ? (
          'Movie not found!!!'
        ) : (
          <MovieCard movie={theMovie} />
        )}
      </div>
    </>
  );
};
