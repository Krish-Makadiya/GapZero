import ytSearch from 'yt-search';

async function test() {
  const missingSkill = "React.js";
  const cleanSkill = missingSkill.replace(/\//g, ' ');
  const searchResults = await ytSearch(`${cleanSkill} masterclass tutorial`);

  let potentialVideos = searchResults.videos
    .filter(v => {
      const title = v.title.toLowerCase();
      const hasNoise = /live|gaming|shorts|vlog|trailer|unboxing|podcast/i.test(title);
      return v.seconds > 120 && v.seconds < 1800 && !hasNoise;
    })
    .slice(0, 5);

  if (potentialVideos.length === 0 && searchResults.videos.length > 0) {
    potentialVideos = searchResults.videos.slice(0, 3);
  }

  let topVideo = potentialVideos[0];
  console.log("Found video:", topVideo?.title, "ID:", topVideo?.videoId);
}

test();
