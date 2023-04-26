import React, { useState, useMemo, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [submitedQuery, setSubmitedQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<MovieData | null>(null);
  const [movieNotFound, setMovieNotFound] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const findMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const movie = await getMovie(query) as MovieData;

    if (movie.Title) {
      setFoundMovie(movie);
      setMovieNotFound(false);
      setSubmitedQuery(query);
    } else {
      setMovieNotFound(true);
    }
  };

  const movie = useMemo(() => {
    if (!foundMovie) {
      return null;
    }

    return {
      title: foundMovie.Title,
      description: foundMovie.Plot,
      imgUrl: foundMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
      imdbId: foundMovie.imdbID,
    };
  }, [submitedQuery, query]);

  const addMovie = () => {
    if (movie) {
      const isMoviePresent = movies.find(
        currMovie => currMovie.imdbId === movie.imdbId,
      );

      if (!isMoviePresent) {
        setMovies(currList => {
          return [
            ...currList,
            movie,
          ];
        });
      }

      setFoundMovie(null);
      setQuery('');
      setSubmitedQuery('');
    }
  };

  useEffect(() => {
    setFoundMovie(null);
    setMovieNotFound(false);
    setSubmitedQuery('');
  }, [query]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          handleChange={handleChange}
          movie={movie}
          findMovie={findMovie}
          movieNotFound={movieNotFound}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
