var express = require("express");
var router = express.Router();
var utils = require("../utils");

const API_VERSION = process.env.API_VERSION || "v54.0";

async function sendJoin(data) {
  let { data: response } = await utils.post(
    `services/apexrest/Contacts`,
    data,
    {
      // "Authorization": "Bearer 00D7Q000000K8rI!AQIAQMaXwWIc8ao7PBhK_jdKjjzcidcF04hiQK_Lc6qmnEEv04EYJxNkVsfq2SIFqXlWeeFOIelcJwNGEdvSAbQGTTSNpXhz",
      "Content-Type": "application/json",
    }
  );
  return response;
}

async function getContacts(path = "") {
  let { data: response } = await utils.get(
    `services/data/${API_VERSION}/sobjects/Contact${path}`
  );
  return response;
}

async function searchContacts(emails) {
  let emailsWithQuote = emails
    .filter((email) => email.trim().length > 0)
    .map((email) => `'${email}'`);
  if (emailsWithQuote.length == 0) {
    return {
      totalSize: 0,
      done: true,
      records: [],
    };
  }
  let query = `Select Id, Name, Email From Contact Where Email IN (${emailsWithQuote.join(
    ","
  )})`;
  console.log("query", query);
  let { data: response } = await utils.get(
    `services/data/${API_VERSION}/query/?q=${query}`
  );
  return response;
}

/* POST contact data. */
router.post("/join", async function (req, res, next) {
  try {
    let data = req.body;
    let response = await sendJoin(data);
    res.json(response);
  } catch (e) {
    if (e.response) {
      let { data, status } = e.response;
      res.status(status);
      res.json(data);
    } else {
      res.status(500);
      res.json(JSON.stringify(e));
    }
  }
});

router.post("/query", async function (req, res, next) {
  try {
    let data = req.body;
    let response = await searchContacts(data);
    res.json(response);
  } catch (e) {
    if (e.response) {
      let { data, status } = e.response;
      res.status(status);
      res.json(data);
    } else {
      res.status(500);
      res.json(JSON.stringify(e));
    }
  }
});

/* GET contact data. */
router.get("/*", async function (req, res, next) {
  try {
    let contacts = await getContacts(req.path);
    res.json(contacts);
  } catch (e) {
    if (e.response) {
      let { data, status } = e.response;
      res.status(status);
      res.json(data);
    } else {
      res.status(500);
      res.json(JSON.stringify(e));
    }
  }
});

module.exports = router;
