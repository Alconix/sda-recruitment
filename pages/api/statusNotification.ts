const handler = async (req, res) => {
  try {
    const { user, name, state } = JSON.parse(req.body);
    const date = new Date().toLocaleString();

    let content = "";

    if (state === "delete") content = `**[DELETE][${date}]** ${user} deleted ${name}'s apply`;
    else if (state === "edit") content = `**[EDIT][${date}]** ${user} edited ${name}'s apply`;
    else content = `**[STATUS][${date}]** ${user} changed ${name}'s apply status to ${state}`;

    await fetch(process.env.DISCORD_LOG_HOOK_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        username: "Secret des Anciens",
      }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
};

export default handler;
