import React, { useState, useMemo, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
// import { ResponseError } from './types/ReponseError';

import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [submitedQuery, setSubmitedQuery] = useState('');
  const [findedMovie, setFindedMovie] = useState<MovieData | null>(null);
  const [movieNotFounded, setMovieNotFounded] = useState(false);

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const toFindMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const movie = await getMovie(query) as MovieData;

    if (movie.Title) {
      setFindedMovie(movie);
      setMovieNotFounded(false);
      setSubmitedQuery(query);
    } else {
      setMovieNotFounded(true);
    }
  };

  const movie = useMemo(() => {
    if (!findedMovie) {
      return null;
    }

    return {
      title: findedMovie.Title,
      description: findedMovie.Plot,
      imgUrl: findedMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${findedMovie.imdbID}`,
      imdbId: findedMovie.imdbID,
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

      setFindedMovie(null);
      setQuery('');
      setSubmitedQuery('');
    }
  };

  useEffect(() => {
    setFindedMovie(null);
    setMovieNotFounded(false);
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
          changeHandler={changeHandler}
          movie={movie}
          toFindMovie={toFindMovie}
          movieNotFounded={movieNotFounded}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
