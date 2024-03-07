import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMovie(null);
    setError('');

    if (query) {
      getMovie(query)
        .then((data: MovieData | ResponseError) => {
          if ('Response' in data && data.Response === 'False') {
            setError(data.Error);
          } else {
            const movieData = data as MovieData;

            setMovie({
              title: movieData.Title,
              description: movieData.Plot,
              imgUrl: movieData.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : movieData.Poster,
              imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
              imdbId: movieData.imdbID,
            });
          }
        }).catch(setError);
    }
  }, [query]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setQuery={setQuery}
          error={error}
          movie={movie}
          setMovies={setMovies}
          setMovie={setMovie}
          query={query}
        />
      </div>
    </div>
  );
};
