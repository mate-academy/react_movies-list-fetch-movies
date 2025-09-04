import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRequest, setUserRequest] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (request: string) => {
    setUserRequest(request);
  };

  const convertMovieData = (data: MovieData) => {
    const poster =
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview';

    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
      imdbId: data.imdbID,
    };
  };

  useEffect(() => {
    if (!userRequest) {
      return;
    }

    setIsLoading(true);

    getMovie(userRequest)
      .then((data: MovieData | ResponseError) => {
        if ('Response' in data && data.Response === 'False') {
          setIsError(true);

          return;
        } else {
          setIsError(false);
          setMovie(convertMovieData(data as MovieData));
        }
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsSearched(true);
      });
  }, [userRequest]);

  useEffect(() => {
    if (query) {
      setIsError(false);
    }
  }, [query]);

  const handleAddMovie = (newMovie: Movie) => {
    setMovies(prev =>
      prev.some(m => m.imdbId === newMovie.imdbId) // перевірка дубліката
        ? prev
        : [...prev, newMovie],
    );
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSubmit={handleSubmit}
          query={query}
          setQuery={setQuery}
          movie={movie}
          setMovie={setMovie}
          addMovie={handleAddMovie}
          isError={isError}
          isSearched={isSearched}
          setIsSearched={setIsSearched}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
