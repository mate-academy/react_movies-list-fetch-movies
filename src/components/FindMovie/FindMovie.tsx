import cn from 'classnames';
import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasSearchError, setSearchError] = useState(false);
  const [hasListError, setListError] = useState(false);

  const loadMovie = async () => {
    setListError(false);
    setSearchError(false);
    setMovieTitle('');
    const movieFromServer: Movie = await getMovie(movieTitle);

    if (!movieFromServer.Title) {
      setSearchError(true);
      setMovie(null);
    } else {
      setMovie(movieFromServer);
    }
  };

  const pushMovie = () => {
    if (movie) {
      setMovie(null);
      const movieIsUnique = !(movies.some(mov => mov.imdbID === movie.imdbID));

      if (movieIsUnique) {
        setMovies([...movies, movie]);
      } else {
        setListError(true);
      }
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn(
                  'input',
                  { 'is-danger': hasSearchError },
                )}
                value={movieTitle}
                onChange={(event) => {
                  setMovieTitle(event.target.value);
                }}
              />
            </div>
          </label>

          {hasSearchError
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )}

          {hasListError
            && (
              <p className="help is-danger">
                The movie is already in the list
              </p>
            )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={pushMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie
          && (
            <>
              <h2 className="title">Preview</h2>
              <MovieCard movie={movie} />
            </>
          )}
      </div>
    </>
  );
};
