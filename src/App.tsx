import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [findMovie, setFindMovie] = useState<null | Movie>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFilm = () => {
    if (!findMovie) {
      return;
    }

    const duplicate = movies.some(movie => movie.imdbId === findMovie.imdbId);

    if (duplicate) {
      setFindMovie(null);

      return;
    }

    setMovies([...movies, { ...findMovie }]);
    setInputTitle('');
    setFindMovie(null);
    setError(null);
  };

  const getInfoMovie = () => {
    if (!inputTitle.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    getMovie(inputTitle)
      .then(data => {
        if (data.Response === 'False') {
          setError(data.Error || 'Movie not found');
          setFindMovie(null);
        } else {
          const normalizeMovie = {
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster !== 'N/A'
                ? data.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          };

          setFindMovie(normalizeMovie);
        }
      })
      .catch(() => setError('Unexpected error'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addFilm={addFilm}
          findMovie={findMovie}
          setFindMovie={setFindMovie}
          inputTitle={inputTitle}
          setInputTitle={setInputTitle}
          isLoading={isLoading}
          error={error}
          setError={setError}
          getInfoMovie={getInfoMovie}
        />
      </div>
    </div>
  );
};
