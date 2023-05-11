import { useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [previevMovie, setPrevievMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [noMovieFound, setNoMovieFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isResponseError = (response: any): response is ResponseError => {
    return response.Response === 'False';
  };

  const loadMovie = async (searchItem: string) => {
    const foundMovie = await getMovie(searchItem);

    if (isResponseError(foundMovie)) {
      setNoMovieFound(true);
      setIsLoading(false);

      return;
    }

    setPrevievMovie({
      title: foundMovie.Title,
      description: foundMovie.Plot,
      imdbId: foundMovie.imdbID,
      imgUrl: foundMovie.Poster
        || 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}/`,
    });
    setNoMovieFound(false);
    setIsLoading(false);
  };

  const handleSearchByQuery = (searchItem: string) => {
    loadMovie(searchItem);
  };

  const handleSetQuery = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trim());
  };

  const handleAddToList = () => {
    if (!movies.find(movie => movie.imdbId === previevMovie?.imdbId)) {
      setMovies([...movies, previevMovie!]);
    }

    setPrevievMovie(null);
    setQuery('');
  };

  const handleLoading = () => {
    setIsLoading(true);
  };

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
        />
      </div>
    </div>
  );
};
