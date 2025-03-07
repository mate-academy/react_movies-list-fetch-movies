import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';

interface FindMovieProps {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie, movies }) => {
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  useEffect(() => {
    setError('');
    setFoundMovie(null);
  }, [title]);

  const normalizeMovie = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getMovie(title);

      if ('Response' in response && response.Response === 'False') {
        setError((response as ResponseError).Error);
        setFoundMovie(null);
      } else {
        const movie = normalizeMovie(response as MovieData);

        setFoundMovie(movie);
        setError('');
      }
    } catch {
      setError('Unexpected error occurred');
      setFoundMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (!foundMovie) {
      return;
    }

    const isDuplicate = movies.some(
      movie => movie.imdbId === foundMovie.imdbId,
    );

    if (!isDuplicate) {
      onAddMovie(foundMovie);
    }

    setTitle('');
    setFoundMovie(null);
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
              onChange={e => setTitle(e.target.value)}
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

          {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
