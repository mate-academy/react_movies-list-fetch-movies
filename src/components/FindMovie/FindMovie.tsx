import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movies';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchWord, setSearchWord] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);

  const loadMovie = async () => {
    const movieFromServer = await getMovie(searchWord);

    if (movieFromServer === null) {
      setSearchError(true);
    }

    setMovie(movieFromServer);
  };

  const handleReset = () => {
    const searchInput = document.querySelector('input');

    if (searchInput !== null) {
      searchInput.value = '';
    }

    setMovie(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
    setSearchError(false);
  };

  const addMovieHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (movie !== null) {
      addMovie(movie);
      setSearchWord('');
      handleReset();
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': searchError })}
                onChange={handleChange}
              />
            </div>
          </label>
          {
            searchError
            && (
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
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={(event) => {
                addMovieHandler(event);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          movie && <MovieCard movie={movie} />
        }
      </div>
    </>
  );
};
