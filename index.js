const debug = require("debug");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

console.log("Application name:", config.get("name"));
console.log("PROJSLUG:", config.get("projslug.value"));
console.log("Password:", config.get("projslug.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

app.use(logger);

const data = [
  { id: 1, name: "Rakhi" },
  { id: 2, name: "Bhav" },
  { id: 3, name: "Ma" }
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/data/", (req, res) => {
  res.send(data);
});

app.post("/api/data/", (req, res) => {
  const { error } = validateProfile(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  const profile = {
    id: data.length + 1,
    name: req.body.name
  };

  data.push(profile);
  res.send(profile);
});

app.put("/api/data/:id", (req, res) => {
  const profile = data.find(v => v.id == parseInt(req.params.id));
  if (!profile) {
    return res.status(404).send("Profile with given ID was not found");
  }

  const { error } = validateProfile(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  profile.name = req.body.name;
  res.send(profile);
});

app.delete("/api/data/:id", (req, res) => {
  const profile = data.find(v => v.id == parseInt(req.params.id));
  if (!profile) return res.status(404).send("Profile not found");

  const index = data.indexOf(profile);
  data.splice(index, 1);

  res.send(profile);
});

app.get("/api/data/:id", (req, res) => {
  const profile = data.find(v => v.id == parseInt(req.params.id));
  if (!profile) {
    return res.status(404).send("Profile with given ID was not found");
  }
  res.send(profile);
});

const validateProfile = profile => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(profile, schema);
};
const port = process.env.PORT || 1234;
app.listen(port, () => console.log(`Listening on port ${port}`));
// const ValidateProfile = profile => {
//   const schema = {
//     name: Joi.string()
//       .min(3)
//       .required()
//   };

//   const result = Joi.validate(profile, schema);
// };

// app.post("/api/data/", (req, res) => {
//   const { error } = ValidateProfile(req.body);
//   if (error) return res.status(404).send("Invalid name");

//   const profile = {
//     id: 10,
//     name: req.body.name
//   };

//   data.push(profile);
//   res.send(data);
// });

// app.put("/data/profile/:id", (req, res) => {
//   const profile = data.find(v => v.id == parseInt(req.params.id));
//   if (!profile) return res.status(404).send("Profile not found");

//   const { error } = ValidateProfile(req.body);
//   if (error) return res.status(400).send("Invalid name");

//   profile.name = req.body.name;
//   res.send(profile);
// });

// app.delete("/api/data/:id", (req, res) => {
//   const profile = data.find(v => v.id == parseInt(req.params.id));
//   if (!profile) return res.status(404).send("Profile not found");

//   const index = data.indexOf(profile);
//   data.splice(index, 1);

//   res.send(course);
// });

// app.get("/api/data/:id", (req, res) => {
//   const profile = data.find(v => v.id == parseInt(req.params.id));
//   if (!profile) return res.status(404).send("Profile not found");

//   res.send(profile);
// });
