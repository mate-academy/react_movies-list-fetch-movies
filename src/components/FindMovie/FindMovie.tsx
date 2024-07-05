import React, { useCallback, useEffect, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type FindMovieProps = {
  addNewMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<FindMovieProps> = ({ addNewMovie }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canFoundMovie, setCanFoundMovie] = useState(true);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    setCanFoundMovie(true);

    applyQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(appliedQuery)
      .then(data => {
        if ((data as ResponseError).Response === 'False') {
          setCanFoundMovie(false);
          setMovieData(null);
        } else {
          setCanFoundMovie(true);
          setMovieData(data as MovieData);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      addNewMovie(movie);
    }

    setQuery('');
    setAppliedQuery('');
    setMovieData(null);
    setMovie(null);
  };

  useEffect(() => {
    if (!movieData) {
      return;
    }

    const poster =
      movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster;

    setMovie({
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    });
  }, [movieData]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit} noValidate>
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
              className={cn('input', { 'is-danger': !canFoundMovie })}
              value={query}
              onChange={handleQuery}
              autoComplete="off"
            />
          </div>

          {!canFoundMovie && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {canFoundMovie && movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
