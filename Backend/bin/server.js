const { server } = require("../app/index");
require("dotenv").config();

const port = process.env.NODE_PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
