import React, {
  FC, useState, ChangeEvent, FormEvent,
} from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/getMovie';
import { URL_IMDB } from '../../api/constants';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const searchMovie = (): void => {
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
          const imdbUrl = URL_IMDB + imdbId;
          const newMoovie = {
            title,
            description,
            imgUrl,
            imdbId,
            imdbUrl,
          };

          setMovie(newMoovie);
          setQuery('');
        } else {
          setError(true);
        }
      });
  };

  const handleSearch = (): void => {
    searchMovie();
  };

  const handleSearchByEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      searchMovie();
    }
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  const handleFocus = () => {
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleAdd}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
          Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              onChange={handleInput}
              onKeyPress={handleSearchByEnter}
              onFocus={handleFocus}
              value={query}
              placeholder="Enter a title to search"
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
              type="button"
              className="button is-light"
              onClick={handleSearch}
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
        <p>{movie?.title}</p>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};
