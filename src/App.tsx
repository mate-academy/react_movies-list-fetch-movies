import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movieFromServ, setMovieFromServ] = useState<Movie[] | []>([]);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const addMovie = useCallback((newMovie: Movie) => {
    if (!movieFromServ.some(movie => movie.imdbID === newMovie.imdbID)) {
      setMovieFromServ([...movieFromServ, newMovie]);
      setIsDuplicate(false);
    } else {
      setIsDuplicate(true);
    }
  }, [movieFromServ]);

  return (
    <div className="page">
      <div className="page-content">

        {movieFromServ && (
          <MoviesList
            movies={movieFromServ}
          />
        )}
      </div>
      <div className="sidebar">
        {isDuplicate
        && <h3>Such movie is allready exist</h3>}
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
