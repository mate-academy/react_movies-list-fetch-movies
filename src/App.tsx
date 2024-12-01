import { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
// import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [suggestedMovie, setSuggestedMovie] = useState<Movie | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function checkIfMovieExists(movie: Movie) {
    return movies.some(m => m.imdbId === movie.imdbId);
  }

  function fullFormReset() {
    setSuggestedMovie(null);
    setIsNotFound(false);
    setCurrentQuery('');
  }

  const handleAddMovie = (movie: Movie) => {
    if (checkIfMovieExists(movie)) {
      return;
    }

    setMovies(prevMovies => [...prevMovies, movie]);
  };

  useEffect(() => {
    if (!currentQuery) {
      return;
    }

    setIsLoading(true);

    getMovie(currentQuery)
      .then(response => {
        if ('Response' in response && response.Response === 'False') {
          setIsNotFound(true);
          setSuggestedMovie(null);
        } else {
          setIsNotFound(false);
          const movieData = response as MovieData;

          if (!movieData.Poster || !movieData.Poster.includes('http')) {
            movieData.Poster =
              'https://via.placeholder.com/360x270.png?text=no%20preview';
          }

          setSuggestedMovie({
            title: movieData.Title,
            imdbId: movieData.imdbID,
            description: movieData.Plot,
            imgUrl: movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentQuery]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onQueryChange={setCurrentQuery}
          isError={isNotFound}
          isErrorChange={setIsNotFound}
          preview={suggestedMovie}
          formReset={fullFormReset}
          onAddMovie={handleAddMovie}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
