const Fetch = async (endpoint: string) => {
  const response = await fetch(endpoint)
  return await response.json()
}

export default Fetch