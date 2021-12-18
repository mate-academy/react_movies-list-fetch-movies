/* eslint-disable no-console */
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api/movieApi';
import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);
  const [IsMovieFounded, setIsMovieFounded] = useState(true);

  const searchMovieTitle = async (title:string) => {
    try {
      const movie = await getMovie(title);

      if (movie.Response === 'True') {
        setFoundedMovie(movie);
        setIsMovieFounded(true);
      } else {
        setIsMovieFounded(false);
      }
    } catch (error) {
      console.error(
        'An error has occurred',
      );
    }
  };

  const addToList = () => {
    if (!foundedMovie) {
      return;
    }

    if (movies.length) {
      if (movies.find(movie => movie.imdbID === foundedMovie.imdbID)) {
        return;
      }
    }

    setMovies([...movies, foundedMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          searchMovieTitle={searchMovieTitle}
          IsMovieFounded={IsMovieFounded}
          foundedMovie={foundedMovie}
          addToList={addToList}
        />
      </div>
    </div>
  );
};
