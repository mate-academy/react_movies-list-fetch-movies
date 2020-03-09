import React, {
  FC,
  ChangeEvent,
  useState,
  FormEvent,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const URL = 'https://www.omdbapi.com/?apikey=6cf099a&t=';
  const IMDB_URL = 'https://www.imdb.com/title/';
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState(false);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    setQuery(target.value);
    setError(false);
  };

  const handleFindMovie = () => {
    fetch((URL + query))
      .then(response => (
        response.json()
      ))
      .then(newMovieApi => {
        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbID: imdbId,
          Response,
        } = newMovieApi;

        if (Response === 'True') {
          const imdbUrl = IMDB_URL + imdbId;
          const movie = {
            title,
            description,
            imgUrl,
            imdbId,
            imdbUrl,
          };

          setNewMovie(movie);
        } else {
          setError(true);
        }
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newMovie) {
      addMovie(newMovie);
      setQuery('');
      setError(false);
      setNewMovie(null);
    } else {
      setError(true);
    }
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
              onChange={event => onChangeHandler(event)}
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
        {newMovie ? <MovieCard {...newMovie} /> : ''}
      </div>
    </>
  );
};
