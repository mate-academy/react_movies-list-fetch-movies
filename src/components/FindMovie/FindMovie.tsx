import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const defaultPicture = (
  'https://via.placeholder.com/360x270.png?text=no%20preview'
);

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setIsError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(loadedMovie => {
        if ('Error' in loadedMovie) {
          setIsError(true);
        } else {
          setMovie({
            title: loadedMovie.Title,
            description: loadedMovie.Plot,
            imgUrl: (
              loadedMovie.Poster !== 'N/A'
                ? loadedMovie.Poster
                : defaultPicture
            ),
            imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}`,
            imdbId: loadedMovie.imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleClickAddMovie = () => {
    onAddMovie(currentMoviesList => {
      if (movie && !currentMoviesList.some(
        currentMovie => currentMovie.imdbId === movie.imdbId,
      )) {
        return [...currentMoviesList, movie];
      }

      return currentMoviesList;
    });

    setMovie(null);
    setQuery('');
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
              className="input is-dander"
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
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
                onClick={handleClickAddMovie}
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
