export const request = title => fetch(
  ` https://www.omdbapi.com/?i=tt3896198&apikey=f6ee504e&t=${title}`,
)
  .then(response => response.json())
  .catch(() => null);
