import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);
  const DEFAULT_IMG_URL =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getMovie(query);

      if ('Title' in response) {
        const { Title, Plot, Poster, imdbID } = response;

        setPreview({
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A' ? DEFAULT_IMG_URL : Poster,
          imdbId: imdbID,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        });
      } else {
        setHasError(true);
      }
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handleAddMovie = () => {
    const isDuplicate = movies.some(movie => movie.imdbId === preview?.imdbId);

    if (!preview || isDuplicate) {
      setQuery('');
      setPreview(null);

      return;
    }

    setMovies(prevMovies => [...prevMovies, preview]);
    setPreview(null);
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setHasError(false)}
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
              className={classNames('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={!query.trim() || isLoading}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!preview}
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {preview && <MovieCard movie={preview} />}
        </div>
      )}
    </>
  );
};
