import { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

const DEFAULT_IMG_URL
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const checkIfMovieExist = (response: ResponseError | MovieData):
    response is MovieData => !('Error' in response);

  useEffect(() => {
    getMovie(query)
      .then((foundMovie) => {
        if (checkIfMovieExist(foundMovie)) {
          const {
            Title, imdbID, Plot, Poster,
          } = foundMovie;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? DEFAULT_IMG_URL
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        } else {
          setMovie(null);
        }
      });
  }, [query]);

  const addMovie = (newMovie: Movie) => {
    if (!movies.some(({ imdbId }) => imdbId === newMovie.imdbId)) {
      setMovies(prev => [...prev, newMovie]);
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
          setQuery={setQuery}
          movie={movie}
          handleAddMovie={addMovie}
        />
      </div>
    </div>
  );
};
