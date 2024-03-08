const home = async (req, res) => {
  try {
    res.status(200).send("welcome to controller Home  page");
  } catch (e) {}
};

const register = async (req, res) => {
  try {
    console.log(req.body);

    res.status(200).send({ message: req.body });
  } catch (e) {}
};

module.exports = { home, register };
