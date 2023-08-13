const headers = new Headers();
headers.set("Authorization", "Bearer cqt_rQTvyfqRFjYh9VFWTyDfgdxjWh3c"); // DEV API

const endpoint = "https://api.covalenthq.com";

export const getPolygonBalances = async (addr: string) => {
  const res = await fetch(`${endpoint}/v1/matic-mumbai/address/${addr}/balances_v2/?nft=true`, {
    method: "GET",
    headers: headers,
  });

  return await res.json();
};
