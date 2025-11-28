// FREE Crypto News + FREE AI Summary Service
// NO GEMINI, NO API KEY, ZERO COST

export async function fetchCryptoNews() {
  // Free crypto news API
  const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";

  const res = await fetch(url);
  const data = await res.json();

  // Free HuggingFace summary (local summarizer)
  async function summarize(text: string) {
    try {
      const sumRes = await fetch(
        "https://hf.space/embed/mikeee/gradio-summarization/+/api/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [text]
          })
        }
      );

      const sumData = await sumRes.json();
      return sumData.data?.[0] || "Summary not available.";
    } catch (e) {
      return "Summary unavailable.";
    }
  }

  // Transform into your UI format
  const items = await Promise.all(
    data.Data.slice(0, 20).map(async (item: any) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      image: item.imageurl,
      url: item.url,
      published: item.published_on * 1000,
      source: item.source,
      summary: await summarize(item.body)
    }))
  );

  return { items };
}

export async function rephraseText(text: string) {
  try {
    const result = await fetch(
      "https://hf.space/embed/mikeee/gradio-paraphraser/+/api/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [text]
        })
      }
    );

    const json = await result.json();
    return json.data?.[0] || text;
  } catch (e) {
    return text;
  }
}
