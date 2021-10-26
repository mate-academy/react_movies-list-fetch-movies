import React from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends React.Component<{}, State> {
  state: State = {
    movies: [],
  };

  addMovie = (movieToAdd: Movie) => {
    const { movies } = this.state;
    const validation = movies.some(movie => movie.imdbID === movieToAdd.imdbID);

    if (!validation) {
      this.setState(prevState => ({
        movies: [
          ...prevState.movies,
          movieToAdd,
        ],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAddMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
