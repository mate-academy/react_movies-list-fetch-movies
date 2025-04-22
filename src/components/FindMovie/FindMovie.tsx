import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAdd }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizeMovie = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getMovie(title);

      if ('Error' in response) {
        setError(response.Error);
        setMovieData(null);
      } else {
        setMovieData(normalizeMovie(response));
      }
    } catch {
      setError('Failed to fetch movie');
      setMovieData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!movieData) {
      return;
    }

    const isDuplicate = movies.some(movie => movie.imdbId === movieData.imdbId);
  
  if (isDuplicate) {
    setTitle('');
    setMovieData(null);
    setError('This movie is already in the list');
    return;
  }

  onAdd(movieData);
  setTitle('');
  setMovieData(null);
  setError(null);
  };

  useEffect(() => {
    setError(null);
  }, [title]);

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
              className="input is-danger"
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
              disabled={!title.trim() || loading}
            >
              Find a movie
            </button>
          </div>

          {movieData && (
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

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieData} />
        </div>
      )}
    </>
  );
};
