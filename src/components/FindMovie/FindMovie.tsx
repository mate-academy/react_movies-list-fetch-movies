import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { getMovieCard } from '../../utils/getMovieCard';

type Props = {
  movieAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movieAdd = () => {} }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [query, setQuery] = useState('');

  const findMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query.trim().toLowerCase())
      .then(result => {
        if ('Error' in result) {
          setMovieData(null);
          setIsError(true);
        } else {
          setMovieData(result);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const movie = getMovieCard(movieData);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleAddMovieCard = () => {
    if (movie) {
      movieAdd(movie);
    }

    setMovieData(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
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
              className={cn({
                'input is-danger': isError,
                input: !isError,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {isError && (
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
              className={cn({
                'button is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={!query.trim()}
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
                onClick={handleAddMovieCard}
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
