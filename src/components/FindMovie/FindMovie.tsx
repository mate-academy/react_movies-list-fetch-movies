import { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard/MovieCard';

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);

  const normalizeMovie = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
    imdbId: data.imdbID,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setPreview(null);

    try {
      const result = await getMovie(title.trim());

      if ('Error' in result) {
        setError(result.Error);
      } else {
        const normalized = normalizeMovie(result);

        setPreview(normalized);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    const alreadyExists = movies.some(m => m.imdbId === preview.imdbId);

    if (!alreadyExists) {
      setMovies(prev => [...prev, preview]);
    }

    setTitle('');
    setPreview(null);
    setError('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="find-movie">
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
          Search
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {preview && (
        <div className="preview">
          <MovieCard movie={preview} />
          <button onClick={handleAdd}>Add</button>
        </div>
      )}
    </div>
  );
};
