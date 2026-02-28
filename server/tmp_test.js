import { getSubtitles } from 'youtube-captions-scraper';

async function test() {
  try {
    console.log('Testing with a famous video (lkIFF4maKMU)...');
    const captions = await getSubtitles({
      videoID: 'lkIFF4maKMU',
      lang: 'en'
    });
    console.log('Success! Captions count:', captions.length);
  } catch (e) {
    console.error('Scraper failed:', e.message);
  }
}

test();
