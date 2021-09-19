import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
  moviesImdbId: string[]
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
    moviesImdbId: [],
  };

  addMovie = (newMovie: Movie) => {
    this.setState((currentState => {
      const { movies, moviesImdbId } = currentState;

      if (!moviesImdbId.includes(newMovie.imdbID)) {
        return {
          movies: [...movies, newMovie],
          moviesImdbId: [...moviesImdbId, newMovie.imdbID],
        };
      }

      return {
        ...currentState,
      };
    }));
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            addMovie={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
