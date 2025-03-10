import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Loader } from '../Loader';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error && 'is-danger'}`}
              value={query}
              onChange={handleClick}
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
            {loading ? (
              <Loader />
            ) : (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
              >
                Find a movie
              </button>
            )}
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
