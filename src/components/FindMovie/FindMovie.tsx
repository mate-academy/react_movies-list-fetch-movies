import React, { useState } from 'react';
import classNames from 'classnames';
import { loadMovies } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  getMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { getMovies } = props;
  const [movie, setMovie] = useState(null as Movie | null);
  const [title, setTitle] = useState('');
  const [toggler, setToggler] = useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setToggler(true);
  };

  const getMovie = async () => {
    const newMovie = await loadMovies(title);

    if (!newMovie.Error) {
      const imdbUrl = `https://www.imdb.com/title/${newMovie.imdbID}`;

      setMovie({ ...newMovie, imdbUrl });
    } else {
      setMovie(null);
      setToggler(false);
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
                  'is-danger': !toggler,
                },
              )}
              value={title}
              onChange={handleChange}
            />
          </div>
          {!toggler && (
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
