import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import { getNewMovie, BASE_URL } from '../../api/api';

type Props = {
  addMovie: (newFilm: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const [title, setTitle] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const { addMovie } = props;

  const showNewMovie = () => {
    setNewMovie(null);

    getNewMovie(title).then(movie => {
      if (title.trim() === '' || movie.Response === 'False') {
        setIsError(true);

        return;
      }

      const film = {
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `${BASE_URL}&t=${movie.Title}`,
        imdbId: movie.imdbID,
      };

      setNewMovie(film);
    });
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const addNewMovie = () => {
    if (newMovie) {
      addMovie(newMovie);
      setTitle('');
    }
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
              className={
                classNames(
                  'input',
                  { 'is-danger': isError },
                )
              }
              value={title}
              onChange={handleChangeTitle}
            />
          </div>
          {isError && (
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
              onClick={showNewMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};
