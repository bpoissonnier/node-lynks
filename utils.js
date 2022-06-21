var axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const AUTH_URL =
    process.env.AUTH_URL ||
    "https://login.salesforce.com/services/oauth2/token";

/**
 * {
    "access_token": "00D7Q000000K8rI!AQIAQELujw3sFr373QrSN3MwPXtUIje9RgP0h_0O7HQxgQ77CllEaGQlN64Utk_pHexSx2LNrWcZPWbo.EEoAX5isJU991Jp",
    "instance_url": "https://lynkspartner.my.salesforce.com",
    "id": "https://login.salesforce.com/id/00D7Q000000K8rIUAS/0057Q000001R93WQAS",
    "token_type": "Bearer",
    "issued_at": "1650919646862",
    "signature": "Ua8/HkjF02NW6yF64yxydkb8YHuP4wJ17eNjexhOv2g="
}
 */
async function getAccessToken() {
    let { data: response } = await axios.post(
        AUTH_URL,
        `grant_type=password&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USERNAME}&password=${PASSWORD}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
        }
    );
    return response;
}

async function post(uri, body = null, headers = {}) {
    let token = await getAccessToken();
    const accessToken = token.access_token;
    const instanceUrl = token.instance_url;
    if (!Boolean(headers["Authorization"])) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return axios.post(`${instanceUrl}/${uri}`, body, {
        headers: headers,
    });
}

async function get(uri, headers = {}) {
    let token = await getAccessToken();
    const accessToken = token.access_token;
    const instanceUrl = token.instance_url;
    headers["Authorization"] = `Bearer ${accessToken}`;
    return axios.get(`${instanceUrl}/${uri}`, {
        headers: headers,
    });
}

module.exports = { getAccessToken, get, post };
