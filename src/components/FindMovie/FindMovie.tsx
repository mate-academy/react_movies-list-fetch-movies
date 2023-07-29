import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

import { getMovie } from '../../api';

type Props = {
  setAllMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
  allMovies: Movie[],
};

export const FindMovie: React.FC<Props> = ({
  setAllMovies,
  allMovies,
}) => {
  const [touched, setTouched] = useState(false);
  const [formInput, setFormInput] = useState('');
  const [newMovie, setNewMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<null | Movie>(null);

  const changeInput = (value: string) => {
    setFormInput(value);
  };

  const moviesQuery = () => {
    setLoading(true);
    getMovie(formInput).then(res => {
      if (!Object.hasOwnProperty.call(res, 'Error')) {
        setNewMovie(res as MovieData);
      } else {
        setNewMovie(null);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (newMovie) {
      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
        imdbId: newMovie.imdbID,
      });
    }
  }, [newMovie]);

  const addMoviesHandle = () => {
    if (!allMovies.find((el) => el.title === movie?.title)) {
      setAllMovies((prev) => (movie ? [...prev, movie] : prev));
    }

    setMovie(null);
    changeInput('');
    setTouched(false);
  };

  const finedHandler = () => {
    setTouched(true);
    moviesQuery();
    setMovie(null);
  };

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInput(e.target.value);
    setTouched(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': !movie && touched && !loading,
              })}
              value={formInput}
              onChange={(e) => changeHandle(e)}
            />
          </div>

          {!movie && touched && !loading && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!formInput.trim()}
              onClick={() => finedHandler()}
            >
              {!touched ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMoviesHandle()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
