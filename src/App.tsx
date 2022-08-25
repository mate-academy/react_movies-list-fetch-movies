import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState('');

  const addMovie = (movie: Movie) => {
    const duplicate = movies.find(item => movie.imdbId === item.imdbId);

    if (!duplicate) {
      setMovies(prev => [...prev, movie]);
    }
  };

  const onChangeTitle = (str: string) => {
    setTitle(str);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          title={title}
          onChangeTitle={onChangeTitle}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
