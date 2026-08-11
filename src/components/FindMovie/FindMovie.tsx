import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

interface Props {
  savedMovies: Movie[];
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ savedMovies, onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isMovieSaved = savedMovies.some(
    movie => movie.imdbId === findMovie?.imdbId,
  );

  const handleAddMovie = () => {
    if (findMovie) {
      if (!isMovieSaved) {
        onAddMovie(findMovie);
      }

      setQuery('');
      setFindMovie(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if (data.Response === 'True') {
          const normalizedMovie = {
            title: data.Title,
            description: data.Plot,
            imdbId: data.imdbID,
            imdbUrl: 'https://www.imdb.com/title/' + data.imdbID,
            imgUrl:
              data.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : data.Poster,
          };

          setFindMovie(normalizedMovie);
          setError(false);
        } else {
          setFindMovie(null);
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
        setFindMovie(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={handleInputChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
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
              disabled={!query.trim()}
              className={`button is-light ${loading ? 'is-loading' : ''}`}
            >
              {findMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {findMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {findMovie && <MovieCard movie={findMovie} />}
        </div>
      )}
    </>
  );
};
