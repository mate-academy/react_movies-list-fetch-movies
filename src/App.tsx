import { useContext, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieContext, MovieProvider } from './Context';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const { setMovie } = useContext(MovieContext);

  const addToTheList = (moviePre: Movie) => {
    const isMovie = movies.filter(mov => mov.imdbId === moviePre.imdbId);

    if (isMovie.length) {
      return setMovie(undefined);
    }

    const newList = [...movies, moviePre];

    return setMovies(newList);
  };

  return (
    <div className="page">
      <MovieProvider>
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>

        <div className="sidebar">
          <FindMovie addToTheList={addToTheList} />
        </div>
      </MovieProvider>
    </div>
  );
};
