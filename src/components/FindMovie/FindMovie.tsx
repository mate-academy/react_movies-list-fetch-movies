import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../helpers/api';

type Props = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movieIsFound, setMovieIsFound] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSearchMovie = async () => {
    if (!title) {
      setErrorMessage('Enter the title please');

      return;
    }

    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = await getMovie(title);

    const movieToAdd: Movie = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    if (!movieToAdd.title) {
      setFoundMovie(null);
      setErrorMessage('Can\'t find a movie with such a title');

      return;
    }

    setFoundMovie(movieToAdd);
    setMovieIsFound(true);
    setErrorMessage('');
  };

  const handleAddMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!foundMovie) {
      return;
    }

    if (movies.some(movie => movie.imdbId === foundMovie.imdbId)) {
      setErrorMessage('This movie is already on the list');

      return;
    }

    setMovies([...movies, foundMovie]);
    setTitle('');
    setFoundMovie(null);
    setMovieIsFound(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleAddMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={handleChange}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': errorMessage })}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={handleSearchMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!movieIsFound}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...foundMovie} />
        </div>
      )}
    </>
  );
};
