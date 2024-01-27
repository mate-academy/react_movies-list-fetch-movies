import React, { useEffect, useMemo, useState } from 'react';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { isMovieData } from '../../services/isMovieData';

type MoviesContextType = {
  loading: boolean;
  searchMovie: string;
  setSearchMovie: React.Dispatch<React.SetStateAction<string>>;
  movie: Movie | null;
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  movieData: MovieData | ResponseError;
  moviesList: Movie[];
  setMoviesList: React.Dispatch<React.SetStateAction<Movie[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>
};

type Props = {
  children: React.ReactNode;
};

export const MovieContext = React.createContext<MoviesContextType>({
  loading: false,
  searchMovie: '',
  setSearchMovie: () => { },
  movie: null,
  setMovie: () => { },
  movieData: {
    Response: 'False',
    Error: '',
  },
  moviesList: [],
  setMoviesList: () => { },
  setCount: () => {},
});

export const MovieProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchMovie, setSearchMovie] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieData, setMovieData] = useState<MovieData | ResponseError>({
    Response: 'False',
    Error: '',
  });
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [firstRender, setFirstRender] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setFirstRender(true);
  }, []);

  useEffect(() => {
    if (firstRender) {
      setLoading(true);

      getMovie(searchMovie)
        .then(res => {
          setMovieData(res);
        })
        .catch(() => { })
        .finally(() => {
          setLoading(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (isMovieData(movieData)) {
      const imgUrl = movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster;

      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      });
    }
  }, [movieData]);

  const value = useMemo(() => ({
    loading,
    searchMovie,
    setSearchMovie,
    movie,
    setMovie,
    movieData,
    moviesList,
    setMoviesList,
    setCount,
  }), [loading, movie, searchMovie, movieData, moviesList]);

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
