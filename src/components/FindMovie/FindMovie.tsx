import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

interface Props {
  movies: Movie[];
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError(false);

    getMovie(title.trim())
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setError(true);
          setPreview(null);
        } else {
          const movie = data as MovieData;
          const DEFAULT_IMAGE =
            'https://via.placeholder.com/360x270.png?text=no%20preview';
          const poster =
            movie.Poster && movie.Poster !== 'N/A'
              ? movie.Poster
              : DEFAULT_IMAGE;

          const normalizedData: Movie = {
            title: movie.Title || '',
            description: movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : '',
            imgUrl: poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          };

          setPreview(normalizedData);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (!preview) {
      return;
    }

    const duplicatedMovie = movies.some(
      movie => movie.imdbId === preview.imdbId,
    );

    if (!duplicatedMovie) {
      onAdd(preview);
    }

    setPreview(null);
    setTitle('');
    setError(false);
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
                'is-danger': error,
              })}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError(false);
              }}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title.trim() || isLoading}
            >
              {!preview ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {preview && (
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

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
