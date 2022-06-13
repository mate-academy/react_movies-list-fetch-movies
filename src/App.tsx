import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { searchFilm } from './api/api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const find = () => {
    setMovie(null);
    setIsLoading(true);
    searchFilm(title)
      .then(cons => {
        if (cons.Response === 'False') {
          setNotFound(true);
          setIsLoading(false);
        } else {
          setMovie(cons);
          setIsLoading(false);
        }
      });
  };

  const addMovieToTheList = () => {
    if (movie && !(movies.some(elem => elem.imdbID === movie.imdbID))) {
      setMovies([...movies, movie]);
      setTitle('');
      setMovie(null);
    }
  };

  const onInputChange = (e:string) => {
    setTitle(e);
    setNotFound(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieToTheList={addMovieToTheList}
          onInputChange={onInputChange}
          isLoading={isLoading}
          defaultTitle={title}
          notFound={notFound}
          movie={movie}
          find={find}
        />
      </div>
    </div>
  );
};
