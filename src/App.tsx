import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api/api';

export const App: React.FC = () => {
  const [movie, setMovie] = useState<Movie>({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [queryInput, setQueryInput] = useState('');
  const [addedMovie, setAddedMovie] = useState<Movie[]>([]);
  const [searchError, setSearchError] = useState(false);

  const handleChange = async () => {
    const movieFromServer = await getMovie(queryInput);

    setMovie(movieFromServer);

    if (!movieFromServer.Title) {
      return setSearchError(true);
    }

    return setSearchError(false);
  };

  const handleAddMovie = (newMovie: Movie) => {
    if (!newMovie.Title) {
      return;
    }

    setAddedMovie([...addedMovie, newMovie]);
  };

  const clearInput = () => {
    setQueryInput('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearInput();
    if (addedMovie.find(movieOnList => movieOnList.imdbID === movie.imdbID)) {
      return;
    }

    handleAddMovie(movie);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={addedMovie} />
      </div>
      <div className="sidebar">
        <FindMovie
          queryInput={queryInput}
          setQueryInput={setQueryInput}
          handleChange={handleChange}
          movie={movie}
          handleSubmit={handleSubmit}
          searchError={searchError}
        />
      </div>
    </div>
  );
};
