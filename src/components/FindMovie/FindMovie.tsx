import { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [title, setTitle] = useState(' ');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [movieExist, setMovieExist] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const findMovie = async (newTitle: string) => {
    const film = await getMovie(newTitle);

    if (!film.Title) {
      setError(true);
      setMovieExist(false);
    } else {
      setMovie(film);
      setError(false);
    }
  };

  const clearInput = () => {
    if (!error) {
      setTitle('');
      setMovie(null);
    }
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie?.imdbID) {
      addMovie(movie);
    }

    setTitle('');
    setMovieExist(false);
  };

  const isMovieExist = () => {
    if (movie && (movies.some(film => film.imdbID === movie.imdbID))) {
      setMovieExist(true);
      setError(false);
    }
  };

  const addNewMovie = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
    }

    isMovieExist();
    clearInput();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                value={title}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input is-link', {
                  'is-danger': error,
                })}
                onChange={handleChange}
              />
            </div>
          </label>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {movieExist && (
            <p className="help is-danger">
              The movie is already inside your list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie(title)}
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

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
