import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [titleValue, settitleValue] = useState('');
  const [serchError, setSerchError] = useState(false);
  const [newMovie, setMovie] = useState<Movie>({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });

  const findMovie = async (title: string) => {
    const loadMovies = await getMovie(title);

    if (!loadMovies.imdbID) {
      setSerchError(true);
    } else {
      setSerchError(false);
    }

    setMovie(loadMovies);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    settitleValue(event.target.value);
  };

  const clearSerch = () => {
    settitleValue('');
    setMovie({
      Poster: '',
      Title: '',
      Plot: '',
      imdbID: '',
    });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                value={titleValue}
                onChange={(event) => {
                  handleInputChange(event);
                }}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'input is-danger': serchError })}
              />
            </div>
          </label>
          {serchError
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={() => {
                findMovie(titleValue);
              }}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={() => {
                addMovie(newMovie);
                clearSerch();
              }}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie.Title
          && (
            <MovieCard movie={newMovie} />
          )}
      </div>
    </>
  );
};
