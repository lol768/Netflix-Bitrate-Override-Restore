function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  let str = "";
  filter.ondata = event => {
    str += decoder.decode(event.data, {stream: true});
  };

  filter.onstop = event => {
    console.log("Trying to find video/audio override code");
    let re = /function ([A-Z])\(a\)\{a\.ctrlKey&&a\.altKey&&a\.shiftKey&&83\=\=a\.keyCode&&[A-Z]\.[A-Za-z$]+?&&([a-z])\(\);\}/;
    str = str.replace(re, "function $1(a){a.ctrlKey&&a.altKey&&a.shiftKey&&83==a.keyCode&&$2();}");
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  //return {}; // not needed
}
browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://assets.nflxext.com/en_us/ffe/player/html/cadmium-playercore-6.0012*"]}, ["blocking"]
);
