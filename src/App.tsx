import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie[]>([]);

  const getSelectedMovie = (movie: Movie) => {
    if (!selectedMovie.some(someMovie => someMovie.imdbID === movie.imdbID)) {
      setSelectedMovie((prevState) => [...prevState, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          selectedMovie={selectedMovie}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          getSelectedMovie={getSelectedMovie}
        />
      </div>
    </div>
  );
};
