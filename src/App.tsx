import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [inList, setInList] = useState(false);

  const addedMovies = (movie: Movie): void => {
    const foundMovie = movies.find(addedMovie => addedMovie.imdbID === movie.imdbID);

    if (!foundMovie) {
      setMovies([...movies, movie]);
    }

    if (foundMovie) {
      setInList(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addedMovies={addedMovies}
          inList={inList}
          setInList={setInList}
        />
      </div>
    </div>
  );
};
