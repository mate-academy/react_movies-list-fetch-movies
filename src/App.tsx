import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          title={title}
          setTitle={setTitle}
          preview={preview}
          setPreview={setPreview}
          error={error}
          setMovies={setMovies}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          movies={movies}
        />
      </div>
    </div>
  );
};
