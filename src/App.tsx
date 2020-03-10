import React, { FC, useState } from 'react';
import './App.scss';
import { getData } from './api/api';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import staticList from './api/movies.json';

export const App: FC = () => {
  const [movies, setMovies] = useState <Movie[]>([...staticList]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCorrectMovies = async (query: string): Promise<Movie> => {
    const movie: MovieFromServer = await getData(query);

    return ({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      imdbId: movie.imdbID,
    });
  };

  const handleLoad = (query: string) => {
    setIsLoading(true);
    getCorrectMovies(query)
      .then(data => {
        if (!data.title) {
          throw new Error('Can\'t find a movie with such a title');
        }

        setIsError('');
        setFoundMovie(data);
      }).catch((err) => {
        setIsError(err.message);
        setFoundMovie(null);
      }).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };


  const addMovie = () => {
    if (foundMovie && !movies.some(movie => movie.imdbId === foundMovie.imdbId)) {
      setMovies([...movies, foundMovie]);
    }

    setFoundMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          isLoading={isLoading}
          error={error}
          addMovie={addMovie}
          findMovie={handleLoad}
          foundMovie={foundMovie}
        />
      </div>
    </div>
  );
};
