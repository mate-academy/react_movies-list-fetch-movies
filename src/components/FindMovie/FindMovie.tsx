import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

interface Props {
  query: string;
  movie: Movie | null;
  onSearch: (arg: Movie | null) => void;
  onChange: (arg: string) => void;
  onAdd: () => void;
}

export const FindMovie: React.FC<Props> = ({
  query,
  onChange,
  onAdd,
  onSearch,
  movie,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMovieSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);
      const movieData = await getMovie(query);

      if (movieData.Response === 'False') {
        setError(movieData.Error || 'Movie not found');

        return;
      }

      const preparedMovie: Movie = {
        id: movieData.imdbID,
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      onSearch(preparedMovie);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setError(null);
  };

  // console.log('FindMovie received movie:', movie);

  return (
    <>
      <form className="find-movie" onSubmit={e => handleMovieSearch(e)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': error })}
              onChange={e => handleInputChange(e.currentTarget.value)}
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && <MovieCard movie={movie} />}
    </>
  );
};
