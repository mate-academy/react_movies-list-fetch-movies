import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieData, setMovieData] = useState<MovieData | ResponseError>();
  const [movie, setMovie] = useState<Movie | undefined>();
  const [query, setQuery] = useState('');
  const [canNotFind, setCanNotFind] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetQuery = (value: string) => {
    setQuery(value);
  };

  const handleCanNotFind = (value: boolean) => {
    setCanNotFind(value);
  };

  const handleSetMovies = (oneMovie: Movie, allMovies: Movie[]) => {
    if (!allMovies.find(mv => mv.imdbId === oneMovie.imdbId)) {
      setMovies(allMovies.concat(oneMovie));
    }

    setMovie(undefined);
    setQuery('');
  };

  const findMovie = (value: string) => {
    async function fetchMovie() {
      setIsLoading(true);
      try {
        const data = await getMovie(value);

        if ('Title' in data) {
          setMovieData(data);
        } else {
          setCanNotFind(true);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  };

  useEffect(() => {
    if (movieData !== undefined && 'Title' in movieData) {
      setMovie(
        {
          title: movieData.Title,
          description: movieData.Plot,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imgUrl: movieData.Poster !== 'N/A'
            ? movieData.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbId: movieData.imdbID,
        },
      );
    }
  }, [movieData]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          handleSetQuery={handleSetQuery}
          query={query}
          findMovie={findMovie}
          canNotFind={canNotFind}
          handleCanNotFind={handleCanNotFind}
          isLoading={isLoading}
          handleSetMovies={handleSetMovies}
          movies={movies}
        />
      </div>
    </div>
  );
};
