import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovies } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchMovie, setSearchMovie] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTitleInput, setIsTitleInput] = useState(true);
  const [isMovieFound, setIsMovieFound] = useState(true);

  const getMovie = async (movieTitle: string) => {
    const foundedMovie = await getMovies(movieTitle);

    if (foundedMovie.Response === 'False') {
      setIsMovieFound(false);
      setIsTitleInput(false);
    } else {
      setMovie(foundedMovie);
      setIsMovieFound(true);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchMovie(value);
    setIsTitleInput(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMovie(movie);
    setSearchMovie('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  {
                    'is-danger': !isMovieFound,
                  })}
                value={searchMovie}
                onChange={handleInput}
              />
            </div>
          </label>

          {!isTitleInput
            && (
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
              onClick={() => getMovie(searchMovie)}
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
          {`${isMovieFound
            ? 'Preview'
            : 'Movie not found'}`}
        </h2>
        {(isMovieFound && movie) && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
