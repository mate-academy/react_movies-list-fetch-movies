import { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [previevMovie, setPrevievMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [noMovieFound, setNoMovieFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [badRequest, setBadRequest] = useState(false);

  const isResponseError = (
    response: MovieData | ResponseError,
  ): response is ResponseError => {
    return (response as ResponseError).Response === 'False';
  };

  const loadMovie = useCallback(async (searchItem: string) => {
    const foundMovie = await getMovie(searchItem);

    const {
      Title,
      Plot,
      imdbID,
      Poster,
    } = foundMovie as MovieData;

    if (isResponseError(foundMovie)) {
      setNoMovieFound(true);
      setIsLoading(false);

      return;
    }

    setPrevievMovie({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imgUrl: Poster
        || 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
    });
    setNoMovieFound(false);
    setIsLoading(false);
  }, []);

  const handleSearchByQuery = useCallback((searchItem: string) => {
    loadMovie(searchItem);
  }, [loadMovie]);

  const handleSetQuery = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddToList = () => {
    if (!movies.find(movie => movie.imdbId === previevMovie?.imdbId)) {
      setMovies((prevMovies) => [...prevMovies, previevMovie!]);
    }

    setPrevievMovie(null);
    setQuery('');
  };

  const handleLoading = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (query && query.trim().length === 0) {
      setBadRequest(true);
    } else {
      setBadRequest(false);
    }
  }, [query]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onChangeQuery={handleSetQuery}
          onSubmit={handleSearchByQuery}
          noMovieFound={noMovieFound}
          onAddToList={handleAddToList}
          previevMovie={previevMovie}
          onLoading={handleLoading}
          isLoading={isLoading}
          badRequest={badRequest}
        />
      </div>
    </div>
  );
};
