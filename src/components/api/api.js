const baseUrl = 'http://www.omdbapi.com/?i=tt3896198&apikey=59a9b9f3';

const request = url => fetch(baseUrl + url)
  .then(response => response.json());

export const getFilmByTitle = title => (
  request(`&t=${title}`)
    // eslint-disable-next-line max-len
    .then(data => (data.Response === 'False' ? Promise.reject(data.Error) : data))
    .then(film => normalizeFilmKey(film))
);

function normalizeFilmKey(obj) {
  const baseImdbUrl = 'https://www.imdb.com/title';

  return {
    title: obj.Title,
    description: obj.Plot,
    imgUrl: obj.Poster,
    imdbId: obj.imdbID,
    imdbUrl: `${baseImdbUrl}/${obj.imdbID}`,
  };
}
