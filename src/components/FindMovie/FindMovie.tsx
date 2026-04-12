import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAddMovie: (movie: Movie) => boolean | void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    onAddMovie(preview);
    setTitle('');
    setPreview(null);
    setError(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (error) {
      setError(null);
    }
  };

  const PLACEHOLDER =
    'https://via.placeholder.com/360x270.png?text=no%20preview';
  const normalize = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? PLACEHOLDER : data.Poster,
    imdbId: data.imdbID,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    getMovie(title.trim())
      .then(res => {
        if ((res as ResponseError).Response === 'False') {
          setError((res as ResponseError).Error ?? 'Movie not found');
          setPreview(null);
        } else {
          setPreview(normalize(res as MovieData));
          setError(null);
        }
      })
      .catch(() => {
        setError('Network error');
        setPreview(null);
      })
      .finally(() => setLoading(false));
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
              value={title}
              onChange={handleChange}
              className={classNames('input', { 'is-danger': !!error })}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={title.trim() === ''}
            >
              Find a movie
            </button>
          </div>
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <>
            <MovieCard movie={preview} />
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                onClick={handleAdd}
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          </>
        </div>
      )}
    </>
  );
};
