import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  onMovieAdd: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<FindMovieProps> = ({ onMovieAdd, movies }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setPreviewMovie(null);

    try {
      const res = await getMovie(title);

      if (res.Response === 'False') {
        setError(res.Error || "Can't find a movie with such title");
      } else {
        const normalizedMovie: Movie = {
          ...res,
          Poster:
            res.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : res.Poster,
          imdbId: res.imdbID,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
        };

        setPreviewMovie(normalizedMovie);
      }
    } catch (err) {
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
                setError(null);
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
          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movies.some(m => m.imdbId === previewMovie.imdbId)) {
                    setPreviewMovie(null);
                    setTitle('');

                    return;
                  }

                  onMovieAdd(previewMovie);
                  setPreviewMovie(null);
                  setTitle('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
