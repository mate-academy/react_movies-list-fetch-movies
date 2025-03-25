import { useState } from 'react';
import { Movie } from '../types/Movie';
import { getMovie } from '../api';

export const useMovieSearch = () => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleSearch = async (searchTitle: string) => {
    if (!searchTitle.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setFoundMovie(null);

    try {
      const response = await getMovie(searchTitle);

      if ('Error' in response) {
        setError(response.Error);

        return;
      }

      const movie: Movie = {
        title: response.Title,
        description: response.Plot,
        imgUrl:
          response.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      };

      setFoundMovie(movie);
    } catch (err) {
      setError('Failed to fetch movie data');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setTitle('');
    setError('');
    setFoundMovie(null);
  };

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
    setError('');
  };

  return {
    title,
    setTitle: updateTitle,
    isLoading,
    error,
    foundMovie,
    handleSearch,
    clearSearch,
  };
};
