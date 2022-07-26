import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  movies: Movie[];
  onSetMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, onSetMovies }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasNotFoundError, setNotFoundError] = useState(false);
  const sameIdCheck = movies.some(film => film.imdbID === movie?.imdbID);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(target.value);
    setNotFoundError(false);
  };

  const AddMovie = () => {
    if (movie) {
      onSetMovies([...movies, movie]);
      setMovieTitle('');
      setMovie(null);
    }
  };

  const findMovie = () => {
    getMovie(movieTitle)
      .then(foundMovie => (foundMovie.Title
        ? setMovie(foundMovie)
        : setNotFoundError(true)));
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': hasNotFoundError,
              }, {
                'is-success': movie,
              }, {
                'is-warning': sameIdCheck,
              })}
              value={movieTitle}
              onChange={handleInput}
            />
          </div>

          {(hasNotFoundError) && (
            <p className={classNames('help is-danger')}>
              Can&apos;t find a movie with such a title
            </p>
          )}
          {sameIdCheck && (
            <p className={classNames('help is-danger')}>
              You&apos;ve allready added this movie
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={classNames('button', {
                'is-primary': movie,
              }, {
                'is-warning': sameIdCheck,
              })}
              data-cy="add"
              onClick={AddMovie}
              disabled={movie === null || sameIdCheck}
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
