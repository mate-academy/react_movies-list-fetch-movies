import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAddMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(false);
    setPreviewMovie(null);
    setIsLoading(true);

    try {
      const response = await getMovie(title);

      if ('Response' in response && response.Response === 'False') {
        setError(true);

        return;
      }

      const movieData = response as MovieData;
      const normalizedMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster !== 'N/A'
            ? movieData.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setPreviewMovie(normalizedMovie);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPreviewMovie = () => {
    if (!previewMovie) {
      return;
    }

    if (movies.some(movie => movie.imdbId === previewMovie.imdbId)) {
      setPreviewMovie(null);
      setTitle('');

      return;
    }

    onAddMovie(previewMovie);
    setPreviewMovie(null);
    setTitle('');
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
              onChange={event => {
                setTitle(event.target.value);
                setError(false);
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
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={title.trim() === ''}
            >
              {!previewMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddPreviewMovie}
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
