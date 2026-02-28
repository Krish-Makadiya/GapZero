import ytSearch from 'yt-search';

async function test() {
  const missingSkill = "React.js";
  console.log(`🔍 Searching YouTube for: ${missingSkill}...`);
  const cleanSkill = missingSkill.replace(/\//g, ' ');
  const searchResults = await ytSearch(`${cleanSkill} masterclass tutorial`);

  console.log(`Found ${searchResults.videos.length} total videos.`);

  let potentialVideos = searchResults.videos
    .filter(v => {
      const title = v.title.toLowerCase();
      const hasNoise = /live|gaming|shorts|vlog|trailer|unboxing|podcast/i.test(title);
      // User reports "unable to fetch video", maybe the duration filter is too strict?
      return v.seconds > 120 && v.seconds < 1800 && !hasNoise;
    })
    .slice(0, 5);

  console.log(`Potential videos after filter: ${potentialVideos.length}`);
  if (potentialVideos.length > 0) {
    console.log(`Top Video: ${potentialVideos[0].title} (ID: ${potentialVideos[0].videoId})`);
  } else {
    console.log("NO VIDEOS FOUND AFTER FILTERING.");
    if (searchResults.videos.length > 0) {
      console.log("First raw result:", searchResults.videos[0].title);
    }
  }
}

test();
