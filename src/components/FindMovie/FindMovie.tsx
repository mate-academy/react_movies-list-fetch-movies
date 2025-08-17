import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface Props {
  moviesList: Movie[];
  onAddMovies: (value: Movie[]) => void;
}

const DEFAULT_POSTER_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

function normalizeMovieData(data: MovieData): Movie {
  return {
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? DEFAULT_POSTER_URL : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  };
}

export const FindMovie: React.FC<Props> = ({ moviesList, onAddMovies }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setMovie(null);

    getMovie(query.trim())
      .then(response => {
        if ('Response' in response && response.Response === 'False') {
          setErrorMessage(response.Error);
          setMovie(null);
        } else {
          const normalizedMovieData = normalizeMovieData(response as MovieData);

          setMovie(normalizedMovieData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    const movieExist = moviesList.some(
      (item: Movie) => item.imdbId === movie.imdbId,
    );

    if (movieExist) {
      setQuery('');
      setMovie(null);

      return;
    }

    onAddMovies([...moviesList, movie]);
    setQuery('');
    setMovie(null);
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
              className={classNames('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {/* Can&apos;t find a movie with such a title */}
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
