import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [someMovie, setMovie] = useState<Movie>();
  const [isRequested, setIsRequested] = useState(false);
  const [isNowRequested, setIsNowRequested] = useState(false);

  const isMovieData = (data: MovieData | ResponseError): data is MovieData => {
    return (data as MovieData).Title !== undefined;
  };

  useEffect(() => {
    getMovie(query).then(movie => {
      if (isMovieData(movie) && query.length) {
        setMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
        setShowError(false);
        setIsNowRequested(false);
      } else {
        setShowError(true);
      }
    })
      .catch(() => setShowError(true))
      .finally(() => setIsNowRequested(false));
  }, [query]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setQuery={setQuery}
          movieFound={someMovie}
          setMovies={setMovies}
          setMovie={setMovie}
          query={query}
          showError={showError}
          setShowError={setShowError}
          isRequested={isRequested}
          setIsRequested={setIsRequested}
          isNowRequested={isNowRequested}
          setIsNowRequested={setIsNowRequested}
        />
      </div>
    </div>
  );
};
