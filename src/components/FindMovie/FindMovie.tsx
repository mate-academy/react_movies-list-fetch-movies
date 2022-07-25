import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  moviesList: Movie[],
  onMovieAdd: Dispatch<SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ moviesList, onMovieAdd }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [isMovieFound, setIsMovieFound] = useState<null | boolean>(null);
  const [foundMovie, setFoundMovie] = useState<null | Movie>(null);

  useEffect(() => {
    setIsMovieFound(null);
  }, [movieTitle]);

  const fetchMovie = async () => {
    const movie = await getMovie(movieTitle);

    if (movie.Response === 'True') {
      setIsMovieFound(true);
      setFoundMovie(movie);
    } else {
      setIsMovieFound(false);
      setFoundMovie(null);
    }
  };

  const addMovie = () => {
    if (!foundMovie || moviesList.includes(foundMovie)) {
      return;
    }

    onMovieAdd([
      ...moviesList,
      foundMovie,
    ]);

    setMovieTitle('');
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
              className={classNames('input', {
                'is-danger': isMovieFound === false,
                'is-success': isMovieFound,
              })}
              value={movieTitle}
              onChange={({ target }) => setMovieTitle(target.value)}
            />
          </div>
          {isMovieFound === false && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              className="button is-light"
              onClick={() => fetchMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              data-cy="add"
              disabled={!isMovieFound}
              className="button is-primary"
              onClick={() => addMovie()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {isMovieFound && <MovieCard movie={foundMovie} />}
      </div>
    </>
  );
};
