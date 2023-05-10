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
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [notFoundMovie, setNotFoundMovie] = useState(false);
  const [finished, setFinished] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowErrorMessage(false);
  };

  const getNewMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotFoundMovie(true);
    setFinished(false);

    try {
      if (!query) {
        return;
      }

      const response: MovieData | ResponseError = await getMovie(query);

      if ('Error' in response) {
        setFinished(true);
        setShowErrorMessage(true);

        return;
      }

      setFinished(true);

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
      setNotFoundMovie(false);
      setShowErrorMessage(false);
    } catch {
      throw new Error('error');
    }
  };

  const addNewMovie = () => {
    if (movie !== null) {
      const exist = movies.some((el) => el.title === movie.title);

      if (exist) {
        setMovies([...movies]);
      } else {
        setMovies([...movies, movie]);
      }

      setMovie(null);
      setQuery('');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          movie={movie}
          handleChange={handleChange}
          getNewMovie={getNewMovie}
          addNewMovie={addNewMovie}
          notFoundMovie={notFoundMovie}
          finished={finished}
          showErrorMessage={showErrorMessage}
        />
      </div>
    </div>
  );
};
