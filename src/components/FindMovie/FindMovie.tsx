import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard/MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[];
  setMovies: (val: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHasError(false);
    setQuery(e.target.value);
  }

  function handleMovieAdd() {
    if (movies.every(item => item.imdbId !== movie?.imdbId) && movie !== null) {
      setMovies([...movies, movie]);
    }

    setHasError(false);
    setMovie(null);
    setQuery('');
  }

  function handleSubmit() {
    setIsLoading(true);
    getMovie(query.trim().toLowerCase())
      .then((data: MovieData | ResponseError) => {
        setIsLoading(false);

        if ('Error' in data) {
          setHasError(true);
          setMovie(null);
        } else {
          setHasError(false);
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        }
      });
  }

  return (
    <>
      <form className="find-movie" onSubmit={e => e.preventDefault()}>
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
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {hasError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query === ''}
              onClick={handleSubmit}
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
                onClick={handleMovieAdd}
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
