import React, { useState } from 'react';
import classNames from 'classnames';
import { getData } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [searchMovie, setSearchMovie] = useState('');
  const [movie, setMovie] = useState(null as Movie | null);
  const [isMovieValid, setIsMovieValid] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchMovie(value);
    setIsMovieValid(true);
  };

  const fromApiMovie = async () => {
    const apiMovie = await getData(searchMovie);

    if (apiMovie.Response === 'False') {
      setIsMovieValid(false);
      setMovie(null);

      return;
    }

    setIsMovieValid(true);

    setMovie({
      title: apiMovie.Title,
      description: apiMovie.Plot,
      imgUrl: apiMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${apiMovie.imdbID}/`,
      imdbId: apiMovie.imdbID,
    });

    setSearchMovie('');
  };

  const searchMovieSubmit = () => {
    fromApiMovie();
  };

  const addNewMovie = () => {
    if (!isMovieValid) {
      return;
    }

    addMovie(movie as Movie);
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          searchMovieSubmit();
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
              className={classNames(
                'input',
                {
                  'is-danger': !isMovieValid,
                },
              )}
              value={searchMovie}
              onChange={handleChange}
            />
          </div>

          {!isMovieValid && (
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
              disabled={!movie}
              onClick={(event) => {
                event.preventDefault();
                addNewMovie();
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie as Movie} />
        </div>
      )}
    </>
  );
};
