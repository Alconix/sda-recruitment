export const timestampToString = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timeSince = (date) => {
  if (typeof date !== "object") {
    date = new Date(date);
  }

  const seconds = Math.floor((new Date().getTime() - date) / 1000);

  if (seconds === 0) return "Maintenant";

  let intervalType;

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = "année";
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = "mois";
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = "jour";
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "heure";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "seconde";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    if (intervalType !== "mois") intervalType += "s";
  }

  return `Il y a ${interval} ${intervalType}`;
};
