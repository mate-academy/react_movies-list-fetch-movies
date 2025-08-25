import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMovie, setIsMovie] = useState(true);
  const [addMovie, setAddMovie] = useState<Movie | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setIsMovie(false);
          setAddMovie(null);

          return;
        }

        setIsMovie(true);
        setAddMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    const canAddMovie = movies.some(movie => movie.imdbId === addMovie?.imdbId);

    setQuery('');
    setAddMovie(null);

    if (addMovie && !canAddMovie) {
      setMovies(prevMovies => [...prevMovies, addMovie]);
    }
  };

  useEffect(() => {
    setIsMovie(true);
  }, [query]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          handleSubmit={handleSubmit}
          handleAddMovie={handleAddMovie}
          onQueryChange={setQuery}
          query={query}
          loading={loading}
          isMovie={isMovie}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
