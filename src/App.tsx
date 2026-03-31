import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';

const normalizeMovie = (rawMovie: MovieData): Movie => {
  return {
    imdbId: rawMovie.imdbID,
    title: rawMovie.Title,
    imgUrl:
      rawMovie.Poster !== 'N/A'
        ? rawMovie.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    description: rawMovie.Plot,
    imdbUrl: `https://www.imdb.com/title/${rawMovie.imdbID}`,
  };
};

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleSearch = async () => {
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const response = await getMovie(title);

      if ('Error' in response) {
        setError(response.Error);
      } else {
        const normalized = normalizeMovie(response);
        setPreview(normalized);
      }
    }
    catch {
      setError('Something went wrong');
    }
    finally {
      setLoading(false);
    }
  };

  const handleAdd = (movieToAdd: Movie) => {
    const isAlreadyAdded = movies.some(
      currentMovie => currentMovie.imdbId === movieToAdd.imdbId,
    );

    if (!isAlreadyAdded) {
      setMovies(prev => [...prev, movieToAdd]);
    }

    setPreview(null);
    setTitle('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          value={title}
          onChange={newValue => {
            setTitle(newValue);
            setError(null);
          }}
          onSearch={handleSearch}
          onAddMovie={handleAdd}
          isLoading={loading}
          error={error}
          movie={preview}
          hasPreview={!!preview}
        />
      </div>
    </div>
  );
};
