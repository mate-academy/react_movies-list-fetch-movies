import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovies } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchText, setSearchText] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isTitleInput, setIsTitleInput] = useState(true);
  const [isMovieFound, setIsMovieFound] = useState(true);

  const getMovie = async () => {
    const foundedMovie = await getMovies(searchText);

    if (foundedMovie.Response === 'False') {
      setIsMovieFound(false);
      setIsTitleInput(false);
    } else {
      setMovie(foundedMovie);
      setIsMovieFound(true);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setIsTitleInput(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          addMovie(movie);
          setSearchText('');
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
                className={classNames('input',
                  { 'is-danger': !isMovieFound })}
                value={searchText}
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
              onClick={getMovie}
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
