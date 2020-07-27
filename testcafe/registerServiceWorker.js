//this script is used in the browser directly by testcafe as a client script to ensure that msw is registered w/ the correct url to
// run in testcafe properly.

const getProxyUrl = window["%hammerhead%"].utils.url.getProxyUrl;

window["%hammerhead%"].utils.url.getProxyUrl = function () {
  // "localhost:1337/<sha>/http://localhost:3000"
  // fetch(/todos)
  const url = arguments[0];
  if (!url.startsWith("/mockServiceWorker")) {
    return getProxyUrl.apply(this, arguments);
  }

  return url;
};
