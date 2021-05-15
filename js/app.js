//Variables

var redirect_uri = "http://127.0.0.1:5500/index.html";
var client_id = "b2556024225445c49d82d2b2f0a1bfba";
var client_secret = "96087c62d9c442cbb5772f45fbf8311d";
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

function onPageLoad() {
  if (window.location.search.length > 0) {
    handleRedirect();
  }
}
// Generate a url to request access to the API, this will redirect the user when pressing the Generate button.
function requestAuthorization() {
  client_id = "b2556024225445c49d82d2b2f0a1bfba";
  client_secret = "96087c62d9c442cbb5772f45fbf8311d";
  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private user-top-read user-follow-read";
  window.location.href = url; // Show Spotify's authorization screen
}
// Pull code from URL
function getCode() {
  let code = null;
  const queryString = window.location.search;
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get("code");
  }
  return code;
}
// Removes parameter from url
function handleRedirect() {
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState("", "", redirect_uri); // remove param from url
}
//Request Access & Refresh Token
function fetchAccessToken(code) {
  let body = "grant_type=authorization_code";
  body += "&code=" + code;
  body += "&redirect_uri=" + encodeURI(redirect_uri);
  body += "&client_id=" + client_id;
  body += "&client_secret=" + client_secret;
  callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    "Basic " + btoa(client_id + ":" + client_secret)
  );
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    var data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      access_token = data.access_token;
      localStorage.setItem("access_token", access_token);
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      localStorage.setItem("refresh_token", refresh_token);
    }
    onPageLoad();
  } else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}

function getArtits() {
  fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
  ).then((response) => {
    console.log(
      response.json().then((data) => {
        console.log(data.items[0].name);
        console.log(data.items[1].name);
        console.log(data.items[2].name);
        console.log(data.items[3].name);
        console.log(data.items[4].name);
        console.log(data.items[5].name);
        console.log(data.items[6].name);
        console.log(data.items[7].name);
        console.log(data.items[8].name);
        console.log(data.items[9].name);
      })
    );
  });
}
