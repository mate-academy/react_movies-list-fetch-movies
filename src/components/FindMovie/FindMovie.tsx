import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ movies, onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Movie | null>(null);

  function normalizeMovie(data: MovieData): Movie {
    return {
      imdbId: data.imdbID,
      description: data.Plot || 'No description available',
      title: data.Title,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imgUrl:
        data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster,
    };
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPreview(null);

    if (!title.trim()) {
      setLoading(false);

      return;
    }

    getMovie(title)
      .then(movie => {
        if ('Error' in movie) {
          setError(movie.Error);
        } else {
          setPreview(normalizeMovie(movie));
        }
      })
      .catch(() => setError('Movie not found'))
      .finally(() => setLoading(false));
  }

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    const exists = movies.some(m => m.imdbId === preview.imdbId);

    if (!exists) {
      onAddMovie(preview);
    }

    setTitle('');
    setPreview(null);
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
              className={error ? 'input is-danger' : ''}
              onChange={handleInput}
              value={title}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!title.trim()}
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
                onClick={handleAdd}
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
