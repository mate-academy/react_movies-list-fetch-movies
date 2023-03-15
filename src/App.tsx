import { useState } from 'react';
import { getMovie } from './api';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const error = useState<boolean>(false);
  const [, setIsErrorMessage] = error;
  const preview = useState<boolean>(false);
  const [, setIsPreview] = preview;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const findMoviePreview = (value: string) => {
    setIsLoading(true);
    getMovie(value)
      .then((movie) => {
        if ('Error' in movie) {
          throw new Error(movie.Error);
        }

        setPreviewMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
        setIsPreview(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsPreview(false);
        setIsErrorMessage(true);
        setIsLoading(false);
      });
  };

  const addMovieToList = () => {
    if (
      previewMovie
      && movies.findIndex(({ imdbId }) => imdbId === previewMovie.imdbId) < 0
    ) {
      setMovies(state => [...state, previewMovie]);
    }

    setPreviewMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={previewMovie}
          isLoading={isLoading}
          onFindMovie={findMoviePreview}
          addMovie={addMovieToList}
          error={error}
          preview={preview}
        />
      </div>
    </div>
  );
};
