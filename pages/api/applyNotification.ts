const handler = async (req, res) => {
  try {
    const { name, id } = JSON.parse(req.body);

    await fetch(process.env.DISCORD_APPLY_HOOK_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Nouvelle candidature de ${name} ! @everyone\nhttps://secretdesanciens.fr/apply/${id}`,
        username: "Secret des Anciens",
      }),
    });

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Unexpected error");
    res.end();
  }
};

export default handler;
