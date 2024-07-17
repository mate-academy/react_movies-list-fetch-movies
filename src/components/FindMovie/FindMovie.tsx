import React, { FormEvent, useRef, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQuery = () => {
    if (inputRef.current) {
      setQuery(inputRef.current.value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsErrorShown(false);

    if (query) {
      setIsLoading(true);
      try {
        const film = await getMovie(query);

        if ('Error' in film) {
          setIsErrorShown(true);
          setMovie(null);
        } else {
          setMovie({
            title: film.Title,
            description: film.Plot,
            imgUrl:
              film.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : film.Poster,
            imdbId: film.imdbID,
            imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
          });
        }
      } catch {
        setIsErrorShown(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
              ref={inputRef}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isErrorShown })}
              onChange={() => {
                handleQuery();
                setIsErrorShown(false);
                setMovie(null);
              }}
            />
          </div>
          {isErrorShown && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.trim() === ''}
            >
              Find a movie
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
