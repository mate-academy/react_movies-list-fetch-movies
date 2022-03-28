import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isInList, setIsInList] = useState(false);

  const addMovies = (movie: Movie): void => {
    const foundMovie = movies.find(addMovie => addMovie.imdbID === movie.imdbID);

    if (!foundMovie) {
      setMovies([...movies, movie]);
    } else {
      setIsInList(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovies={addMovies}
          isInList={isInList}
          setIsInList={setIsInList}
        />
      </div>
    </div>
  );
};
