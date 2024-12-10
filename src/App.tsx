import React, { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleSearch(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setSearch(query);
  }

  function handleQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleAddMovie() {
    const isMovie = movies.find(m => m.imdbId === movie?.imdbId);

    if (isMovie) {
      setQuery('');
      setSearch('');
      setMovie(null);

      return;
    }

    if (movie) {
      setMovies([...movies, movie]);
      setQuery('');
      setSearch('');
      setMovie(null);
    }
  }

  function mapToMovie(selectedMovie: MovieData): Movie {
    return {
      title: selectedMovie.Title,
      description: selectedMovie.Plot,
      imgUrl:
        selectedMovie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : selectedMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${selectedMovie.imdbID}`,
      imdbId: selectedMovie.imdbID,
    };
  }

  useEffect(() => {
    async function fetchMovie() {
      setIsLoading(true);
      try {
        const selectedMovie = await getMovie(search);

        if (selectedMovie && 'Poster' in selectedMovie) {
          const searchedMovie: Movie = mapToMovie(selectedMovie);

          setMovie(searchedMovie);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (search !== '') {
      fetchMovie();
    }
  }, [search]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSearch={handleSearch}
          query={query}
          onQuery={handleQuery}
          movie={movie}
          search={search}
          isLoading={isLoading}
          onAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
