import { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

// http://www.omdbapi.com/?apikey=2636363f&t=cat

export function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [movie, setMovie] = useState<Movie>(Object);

  const fetchMovies = () => {
    return fetch('http://www.omdbapi.com/?apikey=2636363f&t=cat')
      .then(response => {
        console.log('response', response);
        response.json()
      })
  };

  useEffect(() => {
    fetchMovies().then(data => {
    setMovies(data)});
  }, []);

  console.log('movie', movies);

  return (
    <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
   );
}
