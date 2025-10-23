import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

interface Props {
  onAdd: (movie: Movie) => void;
}

const POSTER_FALLBACK = 'https://via.placeholder.com/300x445?text=No+Poster';

function normalizeMovie(d: MovieData) {
  return {
    title: d.Title,
    description: d.Plot,
    imgUrl: d.Poster && d.Poster !== 'N/A' ? d.Poster : POSTER_FALLBACK,
    imdbUrl: `https://www.imdb.com/title/${d.imdbID}`,
    imdbId: d.imdbID,
  };
}

function isError(x: MovieData | ResponseError): x is ResponseError {
  return (x as ResponseError).Response === 'False';
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(data => {
        if (isError(data)) {
          setErrorMessage(data.Error || 'Movie not found');
          setPreview(null);

          return;
        } else {
          setPreview(normalizeMovie(data));
        }
      })
      .catch(error => setErrorMessage(String(error)))
      .finally(() => setLoading(false));
    setQuery('');
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    onAdd(preview);

    setErrorMessage('');
    setLoading(false);
    setQuery('');
    setPreview(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => onSubmit(event)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={errorMessage ? 'input is-danger' : 'input'}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {errorMessage && `Can&apos;t find a movie with such a title`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query.trim() || loading}
              data-cy="searchButton"
              type="submit"
              className={
                loading ? `button is-light is-loading` : `button is-light`
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {preview && (
              <button
                onClick={handleAdd}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {preview && <MovieCard movie={preview} />}
      </div>
    </>
  );
};
