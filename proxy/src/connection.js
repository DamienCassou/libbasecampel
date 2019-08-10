const request = require("request-promise-native");
let oauth = require("./oauth");

let auth_token = undefined;

const account_id = "4201305";

async function generate_auth_token({ client_id, client_secret, port }) {
  auth_token = oauth.get_auth_token({ client_id, client_secret, port });
  await auth_token;
  return {};
}

async function get({ url, path, params }) {
  let uri = url || `https://3.basecampapi.com/${account_id}/${path}`;

  if (!auth_token) {
    throw new Error(
      "No auth token set yet. Consider using generate_auth_token() first."
    );
  }

  let response = await request.get({
    json: true,
    uri,
    resolveWithFullResponse: true,
    headers: {
      "User-Agent": "basecampel (damien@cassou.me)",
      Authorization: `Bearer ${(await auth_token).access_token}`
    },
    qs: params
  });

  // if (response.headers.link) {
  //   console.log(`D'autres réponses à lire dans ${response.headers.link}`);
  // }

  return response.body;
}

module.exports = { get, generate_auth_token };