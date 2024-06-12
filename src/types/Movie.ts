export interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

export interface Options {
  NOT_APPLICABLE: 'N/A';
  DEFAULT_PHOTO: string;
  DEFAULT_imdbUrl: string;
}
