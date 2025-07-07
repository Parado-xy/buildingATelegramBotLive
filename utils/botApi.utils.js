async function fetchAutoCaptionsRaw(youtubeUrl) {
  const getVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);
  if (!videoId) {
    throw new Error("Invalid YouTube URL - could not extract video ID");
  }

  try {
    const captionsUrl = `https://video.google.com/timedtext?lang=en&v=${videoId}`;
    console.log(`Fetching captions from: ${captionsUrl}`);

    const res = await fetch(captionsUrl);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch captions: ${res.status} ${res.statusText}`
      );
    }

    const xml = await res.text();
    console.log(`XML response length: ${xml.length}`);

    // Check if XML is empty or doesn't contain captions
    if (!xml || xml.trim().length === 0) {
      return "No captions available for this video.";
    }

    // Check if the response indicates no captions
    if (
      xml.includes("timedtext") === false &&
      xml.includes("<text") === false
    ) {
      return "No captions available for this video.";
    }

    // Regex to extract <text start="X" dur="Y">...</text>
    const matches = [
      ...xml.matchAll(/<text.+?start="(.*?)".*?>(.*?)<\/text>/g),
    ];

    if (matches.length === 0) {
      return "No captions found in the video transcript.";
    }

    const decodeEntities = (str) =>
      str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#10;/g, "\n");

    const captions = matches.map(([_, start, content]) => {
      const time = parseFloat(start).toFixed(2);
      const clean = decodeEntities(content.replace(/\s+/g, " ").trim());
      return `[${time}s] ${clean}`;
    });

    const result = captions.join("\n");

    // Telegram has a 4096 character limit for messages
    if (result.length > 4000) {
      return (
        result.substring(0, 4000) +
        "\n\n... (transcript truncated due to length)"
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching captions:", error);
    throw new Error(`Failed to fetch video captions: ${error.message}`);
  }
}

export { fetchAutoCaptionsRaw };
