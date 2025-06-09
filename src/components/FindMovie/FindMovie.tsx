import React, { useState } from 'react';
import { getMovie } from '../../api';
import { MovieData } from 'types';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: MovieData) => void;
  addedMovies: MovieData[];
}

export const FindMovie: React.FC<Props> = ({ onAdd, addedMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setMovie(null);

    try {
      const result = await getMovie(title.trim());

      if ('Error' in result) {
        setError(result.Error);
      } else {
        setMovie(result);
      }
    } catch {
      setError('Something went wrong...');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    const isAlreadyAdded = addedMovies.some(m => m.imdbID === movie.imdbID);

    if (!isAlreadyAdded) {
      onAdd(movie);
    }

    setTitle('');
    setMovie(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter movie title"
      />

      <button
        type="submit"
        disabled={!title.trim()}
        className={isLoading ? 'is-loading' : ''}
      >
        Submit
      </button>

      {error && <div className="error">{error}</div>}

      {movie && (
        <div className="preview">
          <MovieCard movie={movie} />
          <button type="button" onClick={handleAdd}>
            Add
          </button>
        </div>
      )}
    </form>
  );
};
