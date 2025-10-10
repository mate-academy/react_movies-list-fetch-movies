import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetQuery = (value: string) => {
    setQuery(value);
  };

  const handleMovieFind = async () => {
    setIsLoading(true);

    try {
      const movie: MovieData | ResponseError = await getMovie(query);

      if ('Error' in movie) {
        setIsError(true);

        return;
      }

      setFoundMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl:
          movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (value: boolean) => {
    setIsError(value);
  };

  const handleAddingMovies = () => {
    if (!foundMovie) {
      return;
    }

    const exists: boolean = movies.some((movie: Movie) => {
      return movie.imdbId === foundMovie.imdbId;
    });

    if (exists) {
      setFoundMovie(null);

      return;
    }

    setMovies([...movies, foundMovie]);
    setFoundMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={handleAddingMovies}
          onLoading={isLoading}
          foundMovie={foundMovie}
          onError={isError}
          setError={handleError}
          handleSetQuery={handleSetQuery}
          onMovieSearch={handleMovieFind}
        />
      </div>
    </div>
  );
};
