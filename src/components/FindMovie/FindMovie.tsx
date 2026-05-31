import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard/MovieCard';

type Props = {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
};

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ movies, onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeMovie = (data: MovieData): Movie => ({
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setHasError(false);

    try {
      const result = await getMovie(title.trim());

      if ('Response' in result && result.Response === 'False') {
        setHasError(true);
        setMovie(null);

        return;
      }

      setMovie(normalizeMovie(result as MovieData));
    } catch {
      setHasError(true);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    const alreadyExists = movies.some(
      currentMovie => currentMovie.imdbId === movie.imdbId,
    );

    if (!alreadyExists) {
      onAddMovie(movie);
    }

    setTitle('');
    setMovie(null);
    setHasError(false);
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
              className={`input ${hasError ? 'is-danger' : ''}`}
            />
          </div>

          {hasError && (
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
              disabled={!title.trim()}
              className={`button is-light ${loading ? 'is-loading' : ''}`}
            >
              Find a movie
            </button>
          </div>

          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
