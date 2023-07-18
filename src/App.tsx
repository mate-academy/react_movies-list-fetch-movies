import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formInput, setFormInput] = useState('');
  const [newMovies, setNewMovies] = useState<MovieData | null>(null);

  const changeInput = (value: string) => {
    setFormInput(value);
  };

  const moviesQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    getMovie(formInput).then(res => {
      if (!Object.hasOwnProperty.call(res, 'Error')) {
        setNewMovies(res as MovieData);
      } else {
        setNewMovies(null);
      }
    }).finally(() => {
      const t = e.target as HTMLElement;

      t.classList.remove('is-loading');
    });
  };

  const [movie, setMovie] = useState<null | Movie>(null);

  useEffect(() => {
    if (newMovies) {
      setMovie({
        title: newMovies.Title,
        description: newMovies.Plot,
        imgUrl: newMovies.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : newMovies.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovies.imdbID}`,
        imdbId: newMovies.imdbID,
      });
    }
  }, [newMovies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          formInput={formInput}
          onChangeInput={changeInput}
          onMoviesQuery={moviesQuery}
          movie={movie}
          setMovie={setMovie}
          setAllMovies={setMovies}
          allMovies={movies}
        />
      </div>
    </div>
  );
};
