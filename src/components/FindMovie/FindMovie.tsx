import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

const DEFAULT = {
  PICTURE: 'https://via.placeholder.com/360x270.png?text=no%20preview',
};
const BASEURL = 'https://www.imdb.com/title/';

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    getMovie(query.trim().toLocaleLowerCase())
      .then(response => {
        if ('Error' in response) {
          setError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster === 'N/A' ? DEFAULT.PICTURE : response.Poster,
            imdbId: response.imdbID,
            imdbUrl: BASEURL + response.imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (movie) {
      addMovie(movie);
      setMovie(undefined);
      setQuery('');
      setError(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={error ? 'input is-danger' : 'input'}
              value={query}
              onChange={handleInputChange}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={
                loading ? 'button is-light is-loading' : 'button is-light'
              }
              onClick={handleSubmit}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
