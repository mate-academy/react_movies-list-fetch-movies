import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasQuery, setHasQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFoundMovie, setIsFoundMovie] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasQuery(e.target.value);
    setIsErrorMessage(false);
  };

  const getNewMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!hasQuery) {
        return;
      }

      const response: MovieData | ResponseError = await getMovie(hasQuery);

      if ('Error' in response) {
        setIsErrorMessage(true);
        setIsFoundMovie(false);

        return;
      }

      const {
        Poster,
        Title,
        Plot,
        imdbID,
      } = response;

      const imdbUrl = `https://www.imdb.com/title/${imdbID}`;

      setMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster,
        imdbUrl,
        imdbId: imdbID,
      });
      setIsErrorMessage(false);
      setIsLoading(false);
    } catch {
      throw new Error('error');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewMovie = () => {
    if (movie) {
      const exist = movies.some((el) => el.title === movie.title);

      if (exist) {
        setMovies([...movies]);
      } else {
        setMovies([...movies, movie]);
      }

      setMovie(null);
      setHasQuery('');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          hasQuery={hasQuery}
          movie={movie}
          handleChange={handleChange}
          getNewMovie={getNewMovie}
          addNewMovie={addNewMovie}
          isFoundMovie={isFoundMovie}
          isLoading={isLoading}
          isErrorMessage={isErrorMessage}
        />
      </div>
    </div>
  );
};
