import React, { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api/api';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      const movieFromServer = await getMovie<Movie>(input);

      setMovie(movieFromServer);
    };

    fetchMovie();
  }, [input]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setClicked(false);
  };

  const clickAddHandler = () => {
    if (movies.every(film => film?.imdbID !== movie?.imdbID)) {
      setMovies([...movies, movie]);
      setInput('');
      setClicked(false);
    }
  };

  const clickFindHandler = () => {
    setClicked(true);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          input={input}
          movie={movie}
          click={clicked}
          onFind={clickFindHandler}
          onAdd={clickAddHandler}
          changeInput={changeHandler}
        />
      </div>
    </div>
  );
};
