import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setPreviewMovie(null);

    try {
      const response = await getMovie(trimmed);

      if ('Response' in response && response.Response === 'False') {
        setError("Can't find a movie with such a title");
      } else {
        const movie: Movie = {
          title: response.Title,
          description: response.Plot || '',
          imgUrl:
            response.Poster !== 'N/A'
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setPreviewMovie(movie);
      }
    } catch {
      setError("Can't find a movie with such a title");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (previewMovie) {
      onAdd(previewMovie);
      setTitle('');
      setPreviewMovie(null);
      setError('');
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !!error })}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError('');
              }}
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
              className={classNames('button is-link', { 'is-loading': loading })}
              disabled={loading || !title.trim()}
            >
              Find a movie
            </button>
          </div>
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />

          <div className="field is-grouped mt-4">
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};