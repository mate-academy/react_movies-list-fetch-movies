import React, {
  FC, useState, ChangeEvent, FormEvent,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const URL = 'http://www.omdbapi.com/?apikey=5c8f0f93&t=';
const URL_IMDB = 'https://www.imdb.com/title/';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setIsError(false);
  }

  function handlerFindButton() {
    fetch(URL + query)
      .then(movieFromApi => {
        return movieFromApi.json();
      })
      .then(movieApi => {
        const {
          Title: title, Plot: description, Poster: imgUrl, imdbID: imdbId, Response,
        } = movieApi;

        if (Response === 'True') {
          const imdbUrl = URL_IMDB + imdbId;
          const newMovie = {
            title, description, imgUrl, imdbId, imdbUrl,
          };

          setMovie(newMovie);
        } else {
          setIsError(true);
          setMovie(null);
        }
      });
  }

  function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (movie) {
      setQuery('');
      setIsError(false);
      addMovie(movie);
      setMovie(null);
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
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
              type="button"
              className="button is-light"
              onClick={handlerFindButton}
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
