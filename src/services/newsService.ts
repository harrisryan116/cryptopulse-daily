// 100% FREE Crypto News + Free Summary API

export async function fetchCryptoNews() {
  const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";

  const res = await fetch(url);
  const data = await res.json();

  // Free summarizer (API-Ninjas Open Endpoint via CORS proxy)
  async function summarize(text: string) {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        "https://api.api-ninjas.com/v1/summarize?text=" + text.slice(0, 700)
      )}`;

      const response = await fetch(proxyUrl, {
        headers: {
          "X-Api-Key": "free",
        }
      });

      const json = await response.json();
      return json.summary || "Summary unavailable.";
    } catch (e) {
      return "Summary unavailable.";
    }
  }

  // Format items for UI
  const items = await Promise.all(
    data.Data.slice(0, 15).map(async (item: any) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      image: item.imageurl,
      url: item.url,
      published: item.published_on * 1000,
      source: item.source,
      summary: await summarize(item.body),
    }))
  );

  return { items };
}


export async function rephraseText(text: string) {
  try {
    const endpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      "https://api.api-ninjas.com/v1/paraphrase?text=" + text
    )}`;

    const response = await fetch(endpoint, {
      headers: {
        "X-Api-Key": "free",
      }
    });

    const data = await response.json();
    return data.paraphrase || text;
  } catch (e) {
    return text;
  }
}
