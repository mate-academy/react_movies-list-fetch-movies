import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  getSelectedMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ getSelectedMovie }) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFindMovie = async () => {
    const movie = await getMovie(movieTitle);

    if (movie.Response === 'False') {
      setIsError(true);
    } else {
      setFoundMovie(movie);
    }

    return movie;
  };

  const onSubmit = () => {
    if (movieTitle !== '') {
      if (!foundMovie) {
        handleFindMovie();
      } else if (movieTitle.toLowerCase() === foundMovie.Title.toLowerCase()) {
        getSelectedMovie(foundMovie);
        setMovieTitle('');
        setFoundMovie(null);
      } else {
        handleFindMovie();
      }
    }
  };

  const cleaner = () => {
    setFoundMovie(null);
    setMovieTitle('');
    setIsError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
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
                'input is-info', {
                  'is-danger': isError,
                },
              )}
              value={movieTitle}
              onChange={(event) => {
                if (isError) {
                  setIsError(false);
                }

                setMovieTitle(event.target.value);
              }}
            />
          </div>

          {isError ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                if (movieTitle !== '') {
                  handleFindMovie();
                }
              }}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (foundMovie) {
                  getSelectedMovie(foundMovie);
                }

                setFoundMovie(null);
                setMovieTitle('');
              }}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-danger"
              onClick={cleaner}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {foundMovie && <MovieCard movie={foundMovie} />}
      </div>
    </>
  );
};
