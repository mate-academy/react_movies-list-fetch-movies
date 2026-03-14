import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard/';

type Props = {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const normaliseMovie = (data: MovieData): Movie => ({
    imdbId: data.imdbID,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.trim().length === 0) {
      return;
    }

    setLoading(true);
    setError(false);

    getMovie(query.trim())
      .then((response: MovieData | ResponseError) => {
        if ('Response' in response && response.Response === 'False') {
          setPreview(null);
          setError(true);

          return;
        }

        const movie = normaliseMovie(response as MovieData);

        setPreview(movie);
      })
      .catch(() => {
        setPreview(null);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!preview) {
      return;
    }

    if (!movies.some(a => a.imdbId === preview.imdbId)) {
      onAddMovie(preview);
    }

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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleInputChange}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={query.trim().length === 0}
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
