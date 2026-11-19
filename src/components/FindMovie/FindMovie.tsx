import React, { useState, FormEvent, ChangeEvent } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export const FindMovie: React.FC<{
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<MovieData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeMovie = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await getMovie(title.trim());

      if ('Error' in response) {
        setError(true);
        setPreview(null);
      } else {
        setPreview(response);
        setError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    const movie = normalizeMovie(preview);
    const isDuplicate = movies.some(m => m.imdbId === movie.imdbId);

    if (!isDuplicate) {
      setMovies(prev => [...prev, movie]);
    }

    setTitle('');
    setPreview(null);
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
              onChange={handleTitleChange}
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
              disabled={!title.trim() || loading}
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
          <MovieCard movie={normalizeMovie(preview)} />
        </div>
      )}
    </>
  );
};
