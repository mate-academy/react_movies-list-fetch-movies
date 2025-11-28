import React, { useCallback, useMemo, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
  existing: Movie[];
};

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

function normalize(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onAdd, existing }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<Movie | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const query = title.trim();

      if (!query) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await getMovie(query);

        if ('Error' in res) {
          setPreview(null);
          setError(res.Error || "Can't find a movie with such a title");
        } else {
          setPreview(normalize(res));
        }
      } finally {
        setLoading(false);
      }
    },
    [title],
  );

  const alreadyAdded = useMemo(
    () => !!preview && existing.some(m => m.imdbId === preview.imdbId),
    [existing, preview],
  );

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    if (!alreadyAdded) {
      onAdd(preview);
    }

    setPreview(null);
    setTitle('');
    setError('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
                if (error) {
                  setError('');
                }
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
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
                onClick={handleAdd}
                title={alreadyAdded ? 'Already in the list' : undefined}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {!!preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
