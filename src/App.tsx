import React, { FC, useState } from 'react';
import './App.scss';
import { getData } from './api/api';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import staticList from './api/movies.json';

export const App: FC = () => {
  const [movies, setMovies] = useState <Movie[]>([...staticList]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disabledAdd, setDisabledAdd] = useState<boolean | undefined>(undefined);

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

        setDisabledAdd(undefined);
        setError('');
        setFoundMovie(data);
      }).catch((err) => {
        setDisabledAdd(true);
        setError(err.message);
        setFoundMovie(null);
      }).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };


  const addMovie = () => {
    setDisabledAdd(undefined);
    if (foundMovie && !movies.some(movie => movie.imdbId === foundMovie.imdbId)) {
      setMovies([...movies, foundMovie]);
      setFoundMovie(null);
    } else if (foundMovie) {
      setError('This movie has already been added to your favorites list');
      setDisabledAdd(true);
    } else {
      setError('');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          disabledAdd={disabledAdd}
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
