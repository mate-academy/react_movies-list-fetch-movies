export interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

export type MovieContextType = {
  movies: Movie[];
  movie: Movie | undefined;
  onQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  handleSubmit: (filmName: string) => void;
  handleShowMoveList: (show: boolean) => void;
  handleAddToList: () => void;
  movielist: Movie[];
  handlehaveOnTheList: () => void;
  isLoading: boolean;
  showLoader: boolean;
};
