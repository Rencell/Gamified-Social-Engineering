const base = import.meta.env.VITE_GOPHISH_URL;
const apiKey = import.meta.env.VITE_GOPHISH_API_KEY;

export async function getCampaigns() {
  const res = await fetch(`${base}/api/campaigns/`, {
    headers: {
      "Authorization": apiKey
    }
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${base}/api/users/`, {
    headers: {
      "Authorization": apiKey
    }
  });
  return res.json();
}
