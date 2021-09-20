import React, { useState } from 'react';
import classNames from 'classnames';
import { getData } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [searchMovie, setSearchMovie] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieValid, setIsMovieValid] = useState(true);

  const loadMovie = async () => {
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
    loadMovie();
  };

  const addNewMovie = () => {
    if (!isMovieValid) {
      return;
    }

    addMovie(movie as Movie);
    setMovie(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    searchMovieSubmit();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchMovie(value);
    setIsMovieValid(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addNewMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              onClick={handleClick}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
