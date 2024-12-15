import { fetchFromGrokAI } from './api';

interface SongInfo {
  artist: string;
  song: string;
  trivia?: string;
}

export const extractSongInfo = async (videoTitle: string, apiKey: string): Promise<SongInfo | null> => {
  try {
    const content = await fetchFromGrokAI(
      "You are a system that identifies songs and artists from YouTube video titles.",
      `Extract the song and artist from the YouTube title: ${videoTitle}`,
      apiKey
    );

    const result = content.split('\n');
    const song = result[0]?.replace('**Song:** ', '').trim() || '';
    const artist = result[1]?.replace('**Artist:** ', '').trim() || '';

    if (!song || !artist) {
      throw new Error('Could not extract song info');
    }

    const trivia = await fetchTrivia(song, artist, apiKey);

    return {
      song,
      artist,
      trivia
    };
  } catch (error) {
    console.error('Error extracting song info:', error);
    return null;
  }
};

export const fetchTrivia = async (song: string, artist: string, apiKey: string): Promise<string | null> => {
  try {
    const trivia = await fetchFromGrokAI(
      "You are a system that provides trivia about songs.",
      `I need a paragraph of trivia about the song "${song}" by ${artist}. I'm interested in learning something I probably wouldn't already know. Focus on details like: The song's writing or composition process, any interesting stories from the recording sessions, the song's chart performance or cultural impact beyond just 'it was a hit,' and any unusual or surprising facts about the song's creation or reception. Avoid generic information like 'it was a popular song.'`,
      apiKey
    );
    return trivia || null;
  } catch (error) {
    console.error('Error fetching trivia:', error);
    return null;
  }
};

export const getLyrics = async (artist: string, song: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lyrics');
    }
    const data = await response.json();
    return data.lyrics || null;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};