import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

interface Props {
  onAdd: (newMovie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isMovieNotFoud, setIsMovieNotFoud] = useState(false);
  const [isFinding, setIsFinding] = useState(false);

  const reset = () => {
    setQuery('');
    setIsMovieNotFoud(false);
    setFoundMovie(null);
  };

  const handleOnClick = (event: React.FormEvent) => {
    event.preventDefault();
    setIsFinding(true);

    getMovie(query)
      .then(data => {
        if (Object.hasOwn(data, 'Error')) {
          setIsMovieNotFoud(true);
          setQuery('');
          setFoundMovie(null);
        } else {
          const {
            Title,
            Poster,
            Plot,
            imdbID,
          } = data as MovieData;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          };

          setFoundMovie(newMovie);
        }
      })
      .finally(() => {
        setIsFinding(false);
      });
  };

  const handleOnChange = (newQuery: string) => {
    setQuery(newQuery);
    setIsMovieNotFoud(false);
  };

  const handleOnAdd = (newMovie: Movie) => {
    onAdd(newMovie);
    reset();
  };

  return (
    <>
      <form className="find-movie">
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
              className={cn('input', {
                'is-danger': isMovieNotFoud,
              })}
              value={query}
              onChange={event => handleOnChange(event.currentTarget.value)}
            />
          </div>

          {isMovieNotFoud
            && (
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
              className={cn('button', 'is-light', {
                'is-loading': isFinding,
              })}
              disabled={query === ''}
              onClick={handleOnClick}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {foundMovie
              && (
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => handleOnAdd(foundMovie)}
                >
                  Add to the list
                </button>
              )}
          </div>
        </div>
      </form>

      {foundMovie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={foundMovie} />
          </div>
        )}
    </>
  );
};
