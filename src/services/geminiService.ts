export async function fetchCryptoNews() {
  const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";

  const res = await fetch(url);
  const data = await res.json();

  // Free open summarizer (no key needed)
  async function summarize(text: string) {
    try {
      const res = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          "https://api.api-ninjas.com/v1/summarize?text=" + text.slice(0, 1000)
        )}`,
        {
          headers: {
            "X-Api-Key": "free",
          },
        }
      );

      const json = await res.json();
      return json.summary || "Summary unavailable.";
    } catch (e) {
      return "Summary unavailable.";
    }
  }

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
    const res = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(
        "https://api.api-ninjas.com/v1/paraphrase?text=" + text
      )}`,
      {
        headers: {
          "X-Api-Key": "free",
        },
      }
    );

    const data = await res.json();
    return data.paraphrase || text;
  } catch (e) {
    return text;
  }
}
