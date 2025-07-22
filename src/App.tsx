import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = (query: string) => {
    setLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(true);
          setMovieDetails(null); // Clear movie details on error
        } else {
          setMovieDetails({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A' ? DEFAULT_POSTER : data.Poster,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onAddMovie = (movie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.map(m => m.imdbId).includes(movie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });
    setMovieDetails(null); // Clear movie details after adding
  };

  const onInputChange = () => {
    setError(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSubmit={onFormSubmit}
          error={error}
          movie={movieDetails}
          onAdd={onAddMovie}
          loader={loading}
          onInputChange={onInputChange}
        />
      </div>
    </div>
  );
};
