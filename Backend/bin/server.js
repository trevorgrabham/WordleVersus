const app = require("../app/index");
require("dotenv").config();

const port = process.env.NODE_PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
