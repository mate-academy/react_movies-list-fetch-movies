import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAddMovie: (movie: Movie) => void;
  moviesInList: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, moviesInList }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearForm = () => {
    setQuery('');
    setMoviePreview(null);
    setError(null);
  };

  const transformToMovie = (rawMovieData: MovieData): Movie => {
    return {
      title: rawMovieData.Title,
      description: rawMovieData.Plot,
      imgUrl:
        !rawMovieData.Poster || rawMovieData.Poster === 'N/A'
          ? DEFAULT_IMG
          : rawMovieData.Poster,
      imdbUrl: `https://www.imdb.com/title/${rawMovieData.imdbID}/`,
      imdbId: rawMovieData.imdbID,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMoviePreview(null);

    try {
      const rawData = await getMovie(query.trim());

      if ('Response' in rawData && rawData.Response === 'False') {
        throw new Error(rawData.Error);
      }

      const movieData = rawData as MovieData;
      const transformedMovie = transformToMovie(movieData);

      setMoviePreview(transformedMovie);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Can't find a movie with such a title",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (moviePreview) {
      const isDuplicate = moviesInList.some(
        m => m.imdbId === moviePreview.imdbId,
      );

      if (isDuplicate) {
        clearForm();
      } else {
        onAddMovie(moviePreview);
        clearForm();
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
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
              onChange={e => {
                setQuery(e.target.value);
                setError(null);
                if (moviePreview) {
                  setMoviePreview(null);
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
              className={`button is-light${isLoading ? ' is-loading' : ''}`}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
              disabled={!moviePreview}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>

        {moviePreview ? (
          <MovieCard movie={moviePreview} />
        ) : (
          <p>No movie selected for preview</p>
        )}
      </div>
    </>
  );
};
