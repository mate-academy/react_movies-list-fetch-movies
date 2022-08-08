import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import './App.scss';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState<string>('');
  const [movieInfo, setMovieInfo] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const findMovie = (query: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(query.target.value);
    setNotFound(false);
  };

  const searchMovie = async (query: string) => {
    setIsLoading(true);

    try {
      const movie: MovieData | ResponseError = await getMovie(query);

      if ('Title' in movie) {
        let img = movie.Poster;

        if (!movie.Poster) {
          img = 'https://placeholder.com/360x270.png?text=no+preview';
        }

        setMovieInfo({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: img,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
      } else {
        setNotFound(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addMovie = () => {
    if (movieInfo) {
      if (movies.some(movie => movie.imdbId === movieInfo.imdbId)) {
        setTitle('');
        setMovieInfo(null);
      } else {
        setMovies([
          ...movies,
          movieInfo,
        ]);
        setTitle('');
        setMovieInfo(null);
      }
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie
          onChangeInput={findMovie}
          title={title}
          searchMovie={searchMovie}
          movie={movieInfo}
          handleEvent={handleEvent}
          addMovie={addMovie}
          notFound={notFound}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
