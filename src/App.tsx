import React, { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

import { getMovie } from './api';
import { MovieData } from './types/MovieData';

// import { debounce } from 'lodash';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState('');
  const [addMovie, setAddMovie] = useState<Movie | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMovieToList = () => {
    if (addMovie && !movies.some(mov => mov.imdbId === addMovie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, addMovie]);
    }

    setAddMovie(undefined);
  };

  const handleMovie = (title: string) => {
    setMovie(title);
  };

  useEffect(() => {
    if (movie !== '') {
      setIsLoading(true);
      getMovie(movie)
        .then(response => {
          if ('Title' in response) {
            const movieData = response as MovieData;
            const newMovie = {
              title: movieData.Title,
              description: movieData.Plot,
              imgUrl:
                movieData.Poster && movieData.Poster !== 'N/A'
                  ? movieData.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: 'https://www.imdb.com/title/' + movieData.imdbID,
              imdbId: movieData.imdbID,
            };

            setAddMovie(newMovie);
          } else {
            const errorData = response;

            setError(errorData.Error);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setMovie('');
        });
    }
  }, [movie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          error={error}
          findMovie={handleMovie}
          loadingData={isLoading}
          addMovie={addMovie}
          addMovieToList={addMovieToList}
          clearError={() => setError(null)}
        />
      </div>
    </div>
  );
};
