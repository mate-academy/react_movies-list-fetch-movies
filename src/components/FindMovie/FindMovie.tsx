import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setQuery('');
    setMovie(undefined);

    return;
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizeQuery = query.trim().toLowerCase();

    setLoading(true);

    getMovie(normalizeQuery)
      .then(response => {
        if ('Error' in response) {
          setError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster !== 'N/A'
                ? response.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: response.imdbID,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleOnClick = () => {
    if (movie && !movies.find(mov => mov.imdbId === movie.imdbId)) {
      addMovie({
        title: movie.title,
        description: movie.description,
        imgUrl: movie.imgUrl,
        imdbUrl: movie.imdbUrl,
        imdbId: movie.imdbId,
      });
    }

    reset();
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleQueryChange}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={query ? false : true}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleOnClick();
                }}
              >
                Add to the list
              </button>
            )}
          </div>
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
