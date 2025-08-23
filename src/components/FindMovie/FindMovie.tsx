import React from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { useState } from 'react';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  handleNewMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleNewMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setMovie(null);

    getMovie(title)
      .then(result => {
        if ('Error' in result) {
          setErrorMessage(result.Error);
        } else {
          const foundMovie: Movie = {
            imdbId: result.imdbID,
            title: result.Title,
            description: result.Plot,
            imgUrl:
              result.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : result.Poster,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          };

          setMovie(foundMovie);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = (newMovie: Movie) => {
    handleNewMovie(newMovie);
    setMovie(null);
    setTitle('');
  };

  return (
    <>
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
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': errorMessage })}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setErrorMessage(null);
              }}
            />
          </div>

          {errorMessage && (
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
              disabled={!title || isLoading}
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
                onClick={() => handleAddMovie(movie)}
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
