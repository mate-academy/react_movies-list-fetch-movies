/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie | null) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTitleInput, setIsTitleInput] = useState(true);
  const [isMovieFound, setIsMovieFound] = useState(true);

  const findMovie = async () => {
    const movieFromServer = await getMovie(title);

    if (movieFromServer.Response === 'False') {
      setIsMovieFound(false);
      setIsTitleInput(false);
    } else {
      setMovie(movieFromServer);
      setIsMovieFound(true);
    }
  };

  const handleInput = (event: any) => {
    setTitle(event.target.value);
    setIsTitleInput(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          addMovie(movie);
          setTitle('');
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn('input', {
                  'is-danger': !isMovieFound,
                })}
                value={title}
                onChange={handleInput}
              />
            </div>
          </label>

          <p className="help is-danger">
            {!isTitleInput && (
              'Can not find a movie with such a title'
            )}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">
          {`${isMovieFound ? 'Preview' : 'Movie not found'}`}
        </h2>
        {(isMovieFound && movie) && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
