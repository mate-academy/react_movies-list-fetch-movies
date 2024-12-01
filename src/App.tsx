import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (!movies.find(m => m.imdbId === movie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setSelectedMovie={addMovie} />
      </div>
    </div>
  );
};

// FE FLEX
// 18:06
// `https://www.imdb.com/title/${response.imdbID}`,
// {
// title: movie.Title,
//  ........,
// imbdUrl: `https://www.imdb.com/title/${response.imdbID}`,
// }
