import React, { useState, FormEvent } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie?: (movie: Movie) => void;
  movies?: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies = [] }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const clearPreview = () => {
    setPreview(null);
    setError(false);
  };

  const handleSearch = async (q: string) => {
    if (!q.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setPreview(null);

    try {
      const res = await getMovie(q);

      // ResponseError has Response: 'False'
      if ((res as ResponseError).Response === 'False') {
        setError(true);
        setPreview(null);
      } else {
        const data = res as MovieData;
        const movie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster && data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };

        setPreview(movie);
        setError(false);
      }
    } catch (e) {
      setError(true);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(title);
  };

  const onAdd = () => {
    if (!preview || !addMovie) {
      return;
    }

    // If movie already exists, just clear form
    if (movies.find(m => m.imdbId === preview.imdbId)) {
      setTitle('');
      clearPreview();

      return;
    }

    addMovie(preview);
    setTitle('');
    clearPreview();
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
              className="input"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) {
                  setError(false);
                }
              }}
            />
          </div>

          {error ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={'button is-light' + (loading ? ' is-loading' : '')}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {preview ? (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
              >
                Add to the list
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {preview ? (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      ) : null}
    </>
  );
};
