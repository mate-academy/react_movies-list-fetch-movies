import React, { useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line max-len
  const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const resetAll = () => {
    setQuery('');
    setMovie(null);
  };

  const handleAdd = (newMovie: Movie) => {
    addMovie(newMovie);
    resetAll();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const loadedMovie: MovieData | ResponseError
      = await getMovie(query.trim());

      if ('Error' in loadedMovie) {
        throw Error('no film found');
      } else {
        const imgUrl = loadedMovie.Poster !== 'N/A'
          ? loadedMovie.Poster
          : defaultPicture;

        const newMovie: Movie = {
          title: loadedMovie.Title,
          description: loadedMovie.Plot,
          imgUrl,
          imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}`,
          imdbId: loadedMovie.imdbID,
        };

        setIsError(false);
        setMovie(newMovie);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
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
              className="input is-dander"
              onChange={handleInput}
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
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
            >

              {movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAdd(movie)}
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
