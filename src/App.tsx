import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchedMovie, setSearchedMovie] = useState<Movie>({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });
  const [title, setTitle] = useState<string>('');
  const [isTitle, setIsTitle] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleAddMovie = (newMovie: Movie) => {
    const isDuplicate
      = movies.some((movie) => movie.imdbId === newMovie.imdbId);

    if (!isDuplicate) {
      setMovies(prevMovie => [...prevMovie, newMovie]);
    }

    setTitle('');
    const resetMovie = {
      title: '',
      description: '',
      imgUrl: '',
      imdbUrl: '',
      imdbId: '',
    };

    setSearchedMovie(resetMovie);
  };

  useEffect(() => {
    if (!title) {
      return;
    }

    setIsLoading(false);
    getMovie(title)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((movie: any) => {
        if (movie.Response === 'False' && title) {
          setIsTitle(true);
        } else {
          const newMovie = {
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster !== 'N/A' ? movie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          };

          setSearchedMovie(newMovie);
          setIsTitle(false);
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Unexpected error:', error);
      })
      .finally(() => {
        setIsLoading(true);
      });
  }, [title, searchedMovie.title]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setIsTitle={setIsTitle}
          setTitle={setTitle}
          movie={searchedMovie}
          isTitle={isTitle}
          isLoading={isLoading}
          handleAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
