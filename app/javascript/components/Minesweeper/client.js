export const updateGame = async (gameId, data) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;

  const response = await fetch(`${window.location.origin}/games/${gameId}`, {
    method: "PUT",
    headers: {
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      game: data,
    }),
  });
  return response.json();
};

export const fetchGame = async (gameId) => {
  const response = await fetch(`${window.location.origin}/games/${gameId}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.json();
};