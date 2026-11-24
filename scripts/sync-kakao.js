const port = process.env.PORT || 3000;
fetch(`http://localhost:${port}/api/restaurants/sync`, { method: "POST" })
  .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "동기화 실패"); console.log(data.message); })
  .catch((error) => { console.error(`카카오 식당 동기화 실패: ${error.message}`); process.exitCode = 1; });
