import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

const DEFAUL_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<{
  onAdd: (movie: Movie) => void;
  movies: Movie[];
}> = ({ onAdd, movies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    getMovie(query)
      .then(response => {
        if ((response as ResponseError).Response === 'False') {
          setError("Can't find a movie with such a title");
          setMovie(null);
        } else {
          const movieData = response as MovieData;

          setMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster !== 'N/A' ? movieData.Poster : DEFAUL_POSTER,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        }
      })
      .catch(() => {
        setError('Unexpected error occurred');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    if (!movies.some(m => m.imdbId === movie.imdbId)) {
      onAdd(movie);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              onChange={event => {
                setQuery(event.target.value);
                setError('');
              }}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
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
                onClick={handleAddMovie}
                disabled={!movie}
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
