export const apiUrl = {
  hymn: 'https://adventist-hymnal-api.up.railway.app/hymn'
}

const Fetch = (endpoint: string) => {
  return fetch(endpoint)
    .then(response => response.json())
}

export default Fetch