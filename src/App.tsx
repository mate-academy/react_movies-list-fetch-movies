import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // #region FindMovie
  const [title, setTitle] = useState<string>('');
  const [newMovie, setNewMovie] = useState<Movie | null | undefined>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showMovie, setShowMovie] = useState<boolean>(false);

  const getNewMovie = ({
    Poster,
    Title,
    Plot,
    imdbID,
  }: MovieData) => {
    setNewMovie({
      title: Title,
      description: Plot,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
    });
  };

  const loadMovie = async () => {
    try {
      setShowLoading(true);
      const movie = await getMovie(title)
        .finally(() => setShowLoading(false));

      setShowMovie(true);

      if ('Error' in movie) {
        throw new Error('Error');
      } else {
        getNewMovie(movie as MovieData);
        setShowError(false);
      }
    } catch {
      setNewMovie(undefined);
      setShowError(true);
      setShowMovie(false);
    }
  };
  // #endregion

  const addMovie = () => {
    const isMovieExist = movies
      .some(movie => movie.imdbId === newMovie?.imdbId);
    const shouldAddMovie = movies.length === 0 || (!isMovieExist && newMovie);

    if (shouldAddMovie && newMovie) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          inputValue={title}
          setInputValue={setTitle}
          loadMovie={loadMovie}
          movie={newMovie}
          setShowError={setShowError}
          showError={showError}
          showLoading={showLoading}
          onAddMovie={addMovie}
          setShowLoading={setShowLoading}
          showMovie={showMovie}
        />
      </div>
    </div>
  );
};
