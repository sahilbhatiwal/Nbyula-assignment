const mongooose = require("mongoose");

const connectWithDb = () => {
  mongooose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("db got connected"))
    .catch((err) => {
      console.log("db connection error");
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectWithDb;
