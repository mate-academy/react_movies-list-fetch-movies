import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';

const defaultPicture
= 'https://via.placeholder.com/360x270.png?text=no%20preview';
const root = 'https://www.imdb.com/title/';

type Props = {
  addMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [foundMovie, setFoundMovie] = useState(false);

  const onFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newMovie = await getMovie(query) as MovieData;

      if ('Error' in newMovie) {
        throw new Error();
      }

      setFoundMovie(true);
      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster !== 'N/A'
          ? newMovie.Poster
          : defaultPicture,
        imdbUrl: `${root}${newMovie.imdbID}`,
        imdbId: newMovie.imdbID,
      });
    } catch (e) {
      setError(true);
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addOnClick = () => {
    if (movie) {
      addMovie(movie);
    }

    setFoundMovie(false);
    setMovie(null);
    setQuery('');
  };

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onFormSubmit}>
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={onQueryChange}
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
              disabled={!query}
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addOnClick}
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
