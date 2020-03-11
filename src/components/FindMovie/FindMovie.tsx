import React, { FC, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { MovieCard } from '../MovieCard';

import { BASIC_URL, IMDB_URL } from '../../constants';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setQuery(value);
    setIsError(false);
  }

  const findNewMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch(BASIC_URL + query)
      .then(movieFromApi => {
        return movieFromApi.json();
      })
      .then(movieApi => {
        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbID: imdbId,
          Response,
        } = movieApi;

        if (Response === 'True') {
          const imdbUrl = IMDB_URL + imdbId;
          const newMovie = {
            title,
            description,
            imgUrl,
            imdbId,
            imdbUrl,
          };

          setMovie(newMovie);
        } else {
          setIsError(true);
          setMovie(null);
        }
      });
  };

  const addNewMovie = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
      setIsError(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={findNewMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>
          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn({ input: true, 'is-danger': isError })}
              value={query}
              onChange={handleInput}
            />
          </div>
          <p className="help is-danger">
            {isError ? 'Can\'t find a movie with such a title' : ''}
          </p>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
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
      <div className="container">
        <h2 className="title">Preview</h2>
        {movie ? <MovieCard {...movie} /> : ''}
      </div>
    </>
  );
};
