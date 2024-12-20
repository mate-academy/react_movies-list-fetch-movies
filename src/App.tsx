import { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [querySearch, setQuerySearch] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchOk, setSearchOk] = useState(true);
  const [searchEmpty, setSearchEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  const addMovie = (newMovie: Movie) => {
    const isDuplicate = movies.some(mov => mov.imdbId === newMovie.imdbId);

    if (!isDuplicate) {
      setMovies(prevMovies => [...prevMovies, newMovie]);
    }

    setQuery('');
    setMovie(null);
  };

  function transformMovieData(data: MovieData): Movie {
    return {
      title: data.Title || '',
      description: data.Plot || '',
      imgUrl:
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID || '',
    };
  }

  useEffect(() => {
    if (querySearch) {
      getMovie(querySearch).then(response => {
        if ('Title' in response) {
          setMovie(transformMovieData(response));
          setSearchOk(true);
          setLoading(false);
        } else {
          setLoading(false);
          setSearchOk(false);
        }
      });
    }
  }, [querySearch]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          query={query}
          movies={movies}
          setQuery={setQuery}
          setQuerySerch={setQuerySearch}
          onAdd={addMovie}
          searchOk={searchOk}
          setSearchOk={setSearchOk}
          searchEmpty={searchEmpty}
          setSearchEmpty={setSearchEmpty}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};
