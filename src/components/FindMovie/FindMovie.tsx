import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const resetForm = () => {
    setSearchTitle('');
    setMovie(null);
    setShowAddButton(false);
    setIsFirstSearch(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setSearchTitle(event.target.value);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const response = await getMovie(searchTitle);

      if ('Error' in response) {
        throw new Error(response.Error);
      }

      const newMovie: Movie = {
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      };

      setMovie(newMovie);
      setShowAddButton(true);
      setIsFirstSearch(false);
    } catch {
      setError(true);
      alert('An error occurred while fetching the movie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      setMovies(currentMovies => {
        if (currentMovies.some(({ imdbId }) => imdbId === movie.imdbId)) {
          return currentMovies;
        }

        return [...currentMovies, movie];
      });
    }

    resetForm();
  };

  return (
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
            value={searchTitle}
            placeholder="Enter a title to search"
            className={cn('input', { 'is-danger': error })}
            onChange={handleInputChange}
            aria-describedby={error ? 'errorMessage' : undefined}
          />
        </div>

        {error && (
          <p
            className="help is-danger"
            data-cy="errorMessage"
            id="errorMessage"
          >
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
            disabled={!searchTitle}
          >
            {isFirstSearch ? 'Find a movie' : 'Search again'}
          </button>
        </div>

        {showAddButton && (
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

      {movie && !error && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </form>
  );
};
