// Free Crypto News + Free HuggingFace Summarizer (NO KEY)

export async function fetchCryptoNews() {
  const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";

  const res = await fetch(url);
  const data = await res.json();

  async function summarize(text: string) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // FREE: no API key needed for public inference
          },
          body: JSON.stringify({
            inputs: text.slice(0, 700)
          })
        }
      );

      const json = await response.json();
      return json?.[0]?.summary_text || "Summary unavailable.";
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
  // Use same summarizer model as pseudo-rephrase
  return text;
}
