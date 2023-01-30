import React, { FC, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Context = {
  movies: Movie[],
  query: string,
  movie: Movie | null,
  isMovieExist: boolean,
  isSearch: boolean,

  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  getMovieFromServer: (appliedQuery: string) => void,
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => void,
  addingMovie: () => void,
};

export const AppContext = React.createContext<Context>({
  movies: [],
  query: '',
  movie: null,
  isMovieExist: false,
  isSearch: false,

  handleInput: () => {},
  getMovieFromServer: () => {},
  handleSearch: () => {},
  addingMovie: () => {},
});

export const AppProvider: FC = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieExist, setIsMovieExist] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);

    if (newValue === '' || newValue !== query) {
      setIsMovieExist(false);
    }
  };

  const getMovieFromServer = async (appliedQuery: string) => {
    try {
      const newFilm = await getMovie(appliedQuery);

      setIsSearch(false);

      if ('Poster' in newFilm) {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = newFilm as MovieData;

        const movieImg = Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster;

        const newMovieInList = {
          title: Title,
          description: Plot,
          imgUrl: movieImg,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setIsMovieExist(false);
        setMovie(newMovieInList);
      } else {
        setIsMovieExist(true);
        setMovie(null);
      }
    } catch {
      throw new Error();
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearch(true);
    getMovieFromServer(query);
  };

  const checkMovie = (newMovie: Movie) => {
    return movies.some(film => film.imdbId === newMovie.imdbId);
  };

  const addingMovie = () => {
    if (movie) {
      if (!checkMovie(movie)) {
        setMovies([...movies, movie]);
      }
    }

    setMovie(null);
    setQuery('');
  };

  const contextValue = {
    movies,
    query,
    movie,
    isMovieExist,
    isSearch,

    handleInput,
    getMovieFromServer,
    handleSearch,
    addingMovie,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
