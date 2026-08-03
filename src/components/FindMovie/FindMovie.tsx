import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

function isResponseError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return (data as ResponseError).Response === 'False';
}

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

const normalizeMovieData = (movieData: MovieData): Movie => ({
  title: movieData.Title,
  description: movieData.Plot,
  imgUrl:
    movieData.Poster && movieData.Poster !== 'N/A'
      ? movieData.Poster
      : DEFAULT_POSTER,
  imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
  imdbId: movieData.imdbID,
});

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isQueryEmpty = !query.trim();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMovie(searchQuery);

      if (isResponseError(data)) {
        setError(data.Error || 'Movie not found');
        setMoviePreview(null);
      } else {
        setMoviePreview(normalizeMovieData(data));
      }
    } catch (err) {
      setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (moviePreview) {
      onAddMovie(moviePreview);
      setQuery('');
      setMoviePreview(null);
    }
  };

  return (
    <>
      <form
        className="find-movie box"
        onSubmit={event => {
          event.preventDefault();
          handleSearch(query);
        }}
      >
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
              onChange={event => {
                setQuery(event.target.value);
                if (error) {
                  setError(null);
                }
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
              disabled={isQueryEmpty}
              data-cy="searchButton"
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              type="submit"
            >
              Find a movie
            </button>
          </div>

          {moviePreview && (
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
          )}
        </div>
      </form>

      {moviePreview && (
        <div className="container mt-5" data-cy="previewContainer">
          <h2 className="title is-4">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
