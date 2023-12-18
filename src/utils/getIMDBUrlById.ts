function getIMDBUrlById(id: string) {
  const BASE_URL = 'https://www.imdb.com/title/';

  return BASE_URL + id;
}

export default getIMDBUrlById;
