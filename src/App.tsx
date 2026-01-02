import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [load, setLoad] = useState(false);
  const [searchDanger, setSearchDanger] = useState(false);

  const addMovieHandler = (movie: Movie) => {
    if (movies.every(el => el.imdbId !== movie.imdbId)) {
      setMovies(currentMovies => [...currentMovies, movie]);
      setSearchDanger(false);
    }

    setSearchTitle('');
    setFindedMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          inputValue={searchTitle}
          changeInputValue={setSearchTitle}
          addMovie={addMovieHandler}
          findedMovie={findedMovie}
          changeFindedMovie={setFindedMovie}
          load={load}
          changeLoad={setLoad}
          danger={searchDanger}
          toogleDanger={setSearchDanger}
        />
      </div>
    </div>
  );
};
