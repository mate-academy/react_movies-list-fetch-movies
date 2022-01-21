import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  movies: Movie[] | [],
  addMovies: (film: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({
  movies,
  addMovies,
}) => {
  const [titleForFind, setTitleForFind] = useState('');
  const [errorHide, setErrorHide] = useState(true);
  const [isMatches, setIsMatches] = useState(false);

  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const loader = async (title: string) => {
    const downloadedMovie = await getMovie(title);

    if (!downloadedMovie) {
      setErrorHide(false);
    } else {
      setErrorHide(true);
    }

    setNewMovie(downloadedMovie);
    // eslint-disable-next-line
    console.log(newMovie, downloadedMovie);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newMovie) {
      const result = movies.some((movie) => movie.imdbID === newMovie.imdbID);

      if (!result) {
        addMovies(newMovie);
        setTitleForFind('');
        setNewMovie(null);
        setIsMatches(false);
      } else {
        setTitleForFind('');
        setNewMovie(null);
        setIsMatches(true);
      }
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                value={titleForFind}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': !errorHide })}
                onChange={(event) => {
                  setTitleForFind(event.target.value);
                  setErrorHide(true);
                  setIsMatches(false);
                }}
              />
            </div>
          </label>

          {(!errorHide) && (
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
              onClick={() => loader(titleForFind)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {(newMovie !== null) && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}

      {isMatches && <h2 className="find-movie__notification">This movie is already on the list</h2>}
    </>
  );
};
