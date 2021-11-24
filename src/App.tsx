import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC<{}> = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addToMovieList = (newMovie: Movie) => {
    const onList = movies.find(movie => movie.imdbID === newMovie.imdbID);

    if (!onList) {
      setMovies(currentList => [...currentList, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addToMovieList={addToMovieList} />
      </div>
    </div>
  );
};
