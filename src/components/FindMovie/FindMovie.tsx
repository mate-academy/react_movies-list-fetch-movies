import React, { useState } from 'react';
import classNames from 'classnames';
import { loadMovies } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  getMovies: (movie: Movie) => void;
  onSetIsMovie: (argument: boolean) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { getMovies, onSetIsMovie } = props;
  const [movie, setMovie] = useState(null as Movie | null);
  const [title, setTitle] = useState('');
  const [errorMasage, setToggler] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setToggler(false);
  };

  const getMovie = async () => {
    onSetIsMovie(false);
    const newMovie = await loadMovies(title);

    if (!newMovie.Error) {
      const imdbUrl = `https://www.imdb.com/title/${newMovie.imdbID}`;

      setMovie({ ...newMovie, imdbUrl });
    } else {
      setMovie(null);
      setToggler(true);
    }
  };

  const onAddMovies = () => {
    if (movie) {
      getMovies(movie);
      setMovie(null);
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
              className={classNames(
                'input',
                'is-info', {
                  'is-danger': errorMasage,
                },
              )}
              value={title}
              onChange={handleChange}
            />
          </div>
          {errorMasage && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={errorMasage}
              onClick={onAddMovies}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};
