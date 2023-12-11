import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={(prediction: Movie) => {
            const alreadyInList = movies.findIndex(item => {
              return item.title === prediction.title;
            });

            if (alreadyInList) {
              setMovies((prevState) => [
                ...prevState,
                prediction,
              ]);
            }
          }}
        />
      </div>
    </div>
  );
};
