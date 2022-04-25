import { unsetAuthCookies } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";

initAuth();

const handler = async (req, res) => {
  try {
    await unsetAuthCookies(req, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unexpected error" });
  }

  return res.status(200).json({ status: true });
};

export default handler;
