import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
// import { ResponseError } from './types/ReponseError';

type PreviewMovie = Movie | null;

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [previewMovie, setPreviewMovie] = useState<PreviewMovie>(null);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={newQuery => setQuery(newQuery)}
          movie={previewMovie}
          setMovie={(newMovie: Movie | null) => setPreviewMovie(newMovie)}
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
