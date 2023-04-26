import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canAddMovie, setCanAddMovie] = useState(false);

  function normalizeData(data: MovieData | ResponseError) {
    if ('Error' in data) {
      return;
    }

    const posterUrl = data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster;

    const newMovie = {
      title: data.Title,
      description: data.Plot,
      imgUrl: posterUrl,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };

    setSelectedMovie(newMovie);
    setCanAddMovie(true);
  }

  const handleFormSubmit = async (value: string) => {
    try {
      setIsLoading(true);
      const data = await getMovie(value);

      normalizeData(data);

      if ('Error' in data) {
        setHasLoadingError(true);
        setCanAddMovie(false);
      }
    } catch {
      setHasLoadingError(true);
      setCanAddMovie(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setHasLoadingError(false);
  };

  const handleAddMovie = () => {
    if (!movies.find(movie => movie.imdbId === selectedMovie?.imdbId)
          && selectedMovie) {
      setMovies(prevMovies => [...prevMovies, selectedMovie]);
    }

    setQuery('');
    setCanAddMovie(false);
    setSelectedMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onChangeQuery={handleInputChange}
          onSubmit={handleFormSubmit}
          selectedMovie={selectedMovie}
          isLoading={isLoading}
          hasError={hasLoadingError}
          canAddMovie={canAddMovie}
          onAdd={handleAddMovie}
        />
      </div>
    </div>
  );
};
