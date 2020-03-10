import React, {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { IMDB_URL } from '../../constants';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const findMovie = (): void => {
    getMovie(query)
      .then(movieFromServer => {
        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbID: imdbId,
          Response,
        } = movieFromServer;

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
          setError(true);
        }
      });
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;

    setQuery(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={query}
              onChange={handleInput}
              className={error ? 'input is-danger' : 'input'}
            />
          </div>
          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
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
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};
