import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  addMovie = (movie: Movie): boolean => {
    const includes = this.state.movies
      .findIndex(m => m.imdbID === movie.imdbID);

    if (includes >= 0) {
      return false;
    }

    this.setState(state => ({
      movies: [...state.movies, movie],
    }));

    return true;
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
