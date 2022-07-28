import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { convertMovie } from './utils/__helpers';

export const App = () => {
  const [movies, addMovies] = useState<Movie[]>([]);
  const [query, getQuery] = useState('');
  const [newMovie, getNewMovie] = useState<MovieData | null>(null);
  const [updateMovieList, setUpdateMovieList] = useState(false);

  useEffect(() => {
    if (newMovie === null) {
      return;
    }

    addMovies((currentMovies) => {
      const newFilm = convertMovie(newMovie);
      const checkImdbId
        = currentMovies?.find(movie => movie.imdbId === newFilm.imdbId);

      if (!checkImdbId) {
        return ([
          ...currentMovies,
          newFilm,
        ]);
      }

      return currentMovies;
    });

    setUpdateMovieList(false);
  }, [updateMovieList]);

  return (
    <div className="page">
      <div className="page-content">
        {movies.length && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie
          getQuery={getQuery}
          inputValue={query}
          findNewMovie={getNewMovie}
          onFormSubmit={setUpdateMovieList}
        />
      </div>
    </div>
  );
};
