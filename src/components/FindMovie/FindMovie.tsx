import './FindMovie.scss';

import React, { useState } from 'react';
import cn from 'classnames';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

const defaultPosterUrl =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAdd: (movie: Movie) => void;
};

function convertToMovie(dataFromServer: MovieData): Movie {
  const { Title, Plot, Poster, imdbID } = dataFromServer;

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? defaultPosterUrl : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setHasError(false);

    getMovie(searchQuery)
      .then(dataFromServer => {
        if ('Error' in dataFromServer) {
          setHasError(true);

          return;
        }

        const newMovie = convertToMovie(dataFromServer);

        setMovie(newMovie);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    setHasError(false);
    setSearchQuery('');

    if (movie) {
      onAdd(movie);
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearchSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={searchQuery}
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': hasError })}
              onChange={handleSearchChange}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!searchQuery.trim()}
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
          {<MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
