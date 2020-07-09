import React, { useState, FC } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { MovieInterface, MovieFromServerInterface } from './interfaces/MovieInterface';
import { fetchMovie } from './api/api';

export const App: FC = () => {
  const [movies, setMovies] = useState<MovieInterface[]>([...data]);
  const [isMovieFound, setIsMovieFound] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<MovieInterface | null>(null);

  const requestMovie = async (title: string) => {
    setIsLoading(true);
    const dataFromApi = await fetchMovie<MovieFromServerInterface>(title);

    setIsLoading(false);

    if (dataFromApi.Response === 'False') {
      setIsMovieFound(false);
      setPreview(null);
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
