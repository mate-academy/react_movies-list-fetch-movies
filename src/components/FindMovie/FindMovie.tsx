import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setTouched(true);

    try {
      const result = await getMovie(title.trim());

      if ('Response' in result && result.Response === 'False') {
        setError("Can't find a movie with such a title");
        setPreviewMovie(null);
      } else {
        const normalizedMovie: Movie = {
          imdbId: result.imdbID,
          title: result.Title,
          description: result.Plot,
          imgUrl:
            result.Poster !== 'N/A'
              ? result.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        };

        setPreviewMovie(normalizedMovie);
      }
    } catch {
      setError('Something went wrong');
      setPreviewMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (previewMovie) {
      onAdd(previewMovie);
      setPreviewMovie(null);
      setTitle('');
      setTouched(false);
      setError(null);
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError(null);
                setTouched(true);
              }}
            />
          </div>

          {error && touched && (
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {previewMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!previewMovie}
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {previewMovie ? (
            <MovieCard movie={previewMovie} />
          ) : (
            <p>No preview available</p>
          )}
        </div>
      )}
    </>
  );
};
