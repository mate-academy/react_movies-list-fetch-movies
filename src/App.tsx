import { useState } from 'react';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = (queryString: string) => {
    setLoading(true);

    getMovie(queryString.toLowerCase())
      .then((data: MovieData | ResponseError) => {
        if ('Title' in data) {
          const properPoster = data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster;

          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: properPoster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        } else {
          setIsError(true);
        }
      }).finally(() => setLoading(false));
  };

  const onAddMovie = () => {
    if (movie) {
      const movieIsUnique = !movies.some(
        currentMovie => currentMovie.imdbId === movie?.imdbId,
      );

      if (movieIsUnique) {
        setMovies(prevMovies => [...prevMovies, movie]);
      }

      setQuery('');
      setMovie(null);
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
          onChangeInput={setQuery}
          onSubmit={onSubmit}
          loading={loading}
          movie={movie}
          isError={isError}
          setIsError={setIsError}
          onAddMovie={onAddMovie}
        />
      </div>
    </div>
  );
};
