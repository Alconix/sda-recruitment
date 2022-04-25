export const isAvatarValid = async (avatar: string) => {
  if (avatar === "" || avatar == null) return false;

  try {
    const res = await fetch(avatar, { method: "HEAD" });
    return res.status === 200;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getAvatarFromName = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const getHashOfString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash.toString();
};

const normalizeHash = (hash, min, max) => {
  return Math.floor((hash % (max - min)) + min);
};

const hueRange = [0, 360];
const saturationRange = [50, 75];
const lightnessRange = [25, 60];

export const generateHSL = (name) => {
  const hash = getHashOfString(name);
  const hue = normalizeHash(hash, hueRange[0], hueRange[1]);
  const saturation = normalizeHash(hash, saturationRange[0], saturationRange[1]);
  const lightness = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
