import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
// import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMovie, setPreviewMovie] = useState({} as Movie);

  const handleFindMovie = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    query: string,
  ) => {
    e.preventDefault();
    setLoading(true);
    getMovie(query)
      .then((data) => {
        if ('Error' in data) {
          setError(data.Error);
        } else {
          const movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setPreviewMovie(movie);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          handleFindMovie={handleFindMovie}
          loading={loading}
          error={error}
          setError={setError}
          previewMovie={previewMovie}
          setPreviewMovie={setPreviewMovie}
          movies={movies}
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
