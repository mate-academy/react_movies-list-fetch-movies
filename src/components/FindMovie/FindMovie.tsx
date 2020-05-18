import React, { useState, useEffect } from 'react';

import classNames from 'classnames';
import { debounce } from 'debounce';

import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../helpers/api';

type Props = {
  addMovie: (movie: Movie) => void;
  movieAlreadyExist: boolean;
};

export const FindMovie: React.FC<Props> = ({ addMovie, movieAlreadyExist }) => {
  const [searchInput, setSearchInput] = useState('');
  const [movieFound, setMovieFound] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (movieAlreadyExist) {
      setErrorMessage('Movie already added to the list');
    }
  }, [movieAlreadyExist]);

  const findMovieOnServer = debounce(() => {
    if (searchInput.trim() === '') {
      setErrorMessage('Please enter the movie title');
      setMovieFound(null);

      return;
    }

    const moviePromise = getMovie(searchInput.trim());

    moviePromise.then(movie => {
      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = movie;

      if (!movie.Title) {
        setErrorMessage('Can\'t find a movie with such a title');
        setMovieFound(null);

        return;
      }

      setMovieFound({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
        imdbId: imdbID,
      });
    });
  }, 300);

  const handleAddMovie = () => {
    if (movieFound) {
      addMovie(movieFound);
      setSearchInput('');
      setMovieFound(null);

      return;
    }

    setErrorMessage('Find a movie before adding');
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;

    setErrorMessage('');
    setSearchInput(inputValue);
  };

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="find-movie"
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
              className={
                classNames('input', { 'is-danger': errorMessage })
              }
              value={searchInput}
              onChange={handleSearchInput}
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
              type="button"
              className="button is-light"
              onClick={findMovieOnServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movieFound && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movieFound} />
          </>
        )}
      </div>
    </>
  );
};
