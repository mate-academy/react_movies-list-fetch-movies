import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  onClickAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onClickAddMovie }) => {
  const [loadedMovie, setLoadedMovie] = useState<Movie | null>(null);
  const [hasSuccessResponse, setHasSuccessResponse] = useState(true);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    REACT_APP_DEFAULT_POSTER_IMG,
    REACT_APP_MOVIE_IMDBURL,
  } = process.env;

  const handleFindMovie = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setHasSuccessResponse(true);
      const movieData = await getMovie(query);

      if ('Error' in movieData) {
        throw new Error(`Can't find movie such a ${query}`);
      }

      const {
        Title,
        Poster,
        Plot,
        imdbID,
      } = movieData;

      const newMovie: Movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster === 'N/A'
          ? REACT_APP_DEFAULT_POSTER_IMG as string
          : Poster,
        imdbUrl: `${REACT_APP_MOVIE_IMDBURL}${imdbID}`,
        imdbId: imdbID,
      };

      setLoadedMovie(newMovie);
    } catch (error) {
      setHasSuccessResponse(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuery('');
    setLoadedMovie(null);
    setHasSuccessResponse(true);
  };

  const handleAddMovie = () => {
    if (loadedMovie) {
      onClickAddMovie(loadedMovie);
    }

    resetForm();
  };

  const handleOnChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (!hasSuccessResponse) {
      setHasSuccessResponse(true);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
      >
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
              className="input is-dander"
              value={query}
              onChange={handleOnChangeQuery}
            />
          </div>

          {!hasSuccessResponse && (
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {loadedMovie && (
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

      {loadedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={loadedMovie} />
        </div>
      )}
    </>
  );
};
