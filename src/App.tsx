import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<null | Movie>(null);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line max-len
  const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const findMovieHandler = async (userQuery: string) => {
    setIsLoading(true);

    const data = await getMovie(userQuery);

    if ('Error' in data) {
      setCurrentMovie(null);
      setIsLoading(false);

      return;
    }

    const newMovie: Movie = {
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster === 'N/A' ? defaultPicture : data.Poster,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    };

    setCurrentMovie(newMovie);
    setIsLoading(false);
  };

  const addMovieHandler = () => {
    setMovies(prevMovies => {
      const newMovies = [...prevMovies];

      if (currentMovie) {
        if (newMovies.find(mov => mov.imdbId === currentMovie.imdbId)) {
          return newMovies;
        }

        return [...prevMovies, currentMovie];
      }

      return newMovies;
    });

    setCurrentMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onFind={findMovieHandler}
          movie={currentMovie}
          onAdd={addMovieHandler}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
