import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { MovieI } from './interfaces/MovieI';
import { fetchMovie } from './api/api';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<MovieI[]>([...data]);
  const [isMovieFound, setIsMovieFound] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<MovieI | null>(null);

  const requestMovie = async (title: string) => {
    setIsLoading(true);
    const dataFromApi = await fetchMovie(title);

    setIsLoading(false);

    if (dataFromApi.Response === 'False') {
      setIsMovieFound(false);
    } else {
      setPreview({
        title: dataFromApi.Title,
        description: dataFromApi.Plot,
        imgUrl: dataFromApi.Poster,
        imdbUrl: `https://www.imdb.com/title/${dataFromApi.imdbID}`,
        imdbId: dataFromApi.imdbID,
      });
    }
  };

  const addMovie = () => {
    if (preview !== null && movies.every(movie => movie.imdbId !== preview.imdbId)) {
      setMovies([
        ...movies,
        {
          ...preview,
        },
      ]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          isMovieFound={isMovieFound}
          requestMovie={requestMovie}
          preview={preview}
          isLoading={isLoading}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
