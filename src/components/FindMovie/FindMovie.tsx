import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void;
};

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

const normalizeMovie = (data: MovieData): Movie => ({
  imgUrl: data.Poster === 'N/A' ? DEFAULT_POSTER : data.Poster,
  title: data.Title,
  description: data.Plot,
  imdbId: data.imdbID,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
});

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

  const handleAddToListChange = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoader(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(data.Error);

          return;
        }

        setMovie(normalizeMovie(data));
        setError(null);
      })
      .catch(() => {
        setError('Unexpected error');
      })
      .finally(() => {
        setLoader(false);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleInputChange}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loader ? 'is-loading' : ''}`}
              disabled={!query.trim()}
            >
              {`${movie ? 'Search again' : 'Find a movie'}`}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToListChange}
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
