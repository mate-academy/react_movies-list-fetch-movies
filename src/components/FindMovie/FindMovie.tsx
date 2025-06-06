import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';

type Props = {
  movies: Movie[];
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieError, setMovieError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setMovieError(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query) {
      return;
    }

    setLoading(true);

    getMovie(query)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setMovie(null);
          setMovieError(true);

          return;
        }

        const movieData = data as MovieData;

        const findedMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster && movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setMovie(findedMovie);
      })
      .finally(() => setLoading(false));
  };

  const handleAddButton = () => {
    setMovie(null);
    setQuery('');
    if (movie) {
      if (!movies.some(mov => mov.imdbId === movie?.imdbId)) {
        onAdd(movie);
      }
    }
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
              className={cn('input', { 'is-danger': movieError })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {movieError && (
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!query.trim() || loading}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
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
