export const sendApplyNotification = async (name, id) => {
  console.log("Sending apply notification...");

  await fetch(process.env.NEXT_PUBLIC_DISCORD_APPLY_HOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      content: `Nouvelle candidature de ${name} ! @everyone\nhttps://secretdesanciens.fr/apply/${id}`,
      username: "Secret des Anciens",
    }),
  });
};

export const sendLogNotification = async (user, name, state) => {
  console.log("Sending log notification...");

  const date = new Date().toLocaleString();

  let content = "";

  if (state === "delete") content = `**[DELETE][${date}]** ${user} deleted ${name}'s apply`;
  else if (state === "edit") content = `**[EDIT][${date}]** ${user} edited ${name}'s apply`;
  else content = `**[STATUS][${date}]** ${user} changed ${name}'s apply status to ${state}`;

  await fetch(process.env.NEXT_PUBLIC_DISCORD_LOG_HOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      content: content,
      username: "Secret des Anciens",
    }),
  });
};
