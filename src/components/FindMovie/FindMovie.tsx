import React, {
  FC, useState, ChangeEvent, FormEvent,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { MOVIES_URL, URL_IMDB } from '../../constans';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsError(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!movie) {
      return;
    }

    setQuery('');
    addMovie(movie);
    setMovie(null);
  };

  const getMovie = (searchValue: string) => {
    return fetch(MOVIES_URL + searchValue)
      .then(movieFromServer => {
        return movieFromServer.json();
      });
  };

  const handleFindMovie = () => {
    getMovie(query)
      .then(findMovie => {
        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbID: imdbId,
          Response,
        } = findMovie;

        if (Response === 'True') {
          const imdbUrl = URL_IMDB + imdbId;
          const newMovie = {
            title,
            description,
            imgUrl,
            imdbId,
            imdbUrl,
          };

          setMovie(newMovie);
        } else {
          setMovie(null);
          setIsError(true);
        }
      });
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
              className={`input ${isError ? 'is-danger' : ''}`}
              value={query}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            {isError ? 'Can`t find a movie with such a title' : ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
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
        <h2 className="title">Preview</h2>
        {movie ? <MovieCard {...movie} /> : ''}
      </div>
    </>
  );
};
