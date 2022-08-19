import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return res.status(401).send("Unauthorized");

    const token = req.headers.authorization.split(" ")[1];
    const isCurrentAuth = token.length < 500;

    let decodeData;

    if (token && isCurrentAuth) {
      decodeData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodeData?.id;
    } else {
      decodeData = jwt.decode(token);
      req.userId = decodeData?.sub;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default auth;
