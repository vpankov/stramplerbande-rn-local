export default `
(function () {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };

  function initLogout() {
    try {
      const logoutButton = document.getElementById("account-logout")

      if (logoutButton.isListenerAdded) {
        return
      }

      logoutButton.addEventListener("click", onLogout);
      logoutButton.isListenerAdded = true

      function onLogout(event) {
        event.preventDefault()
        const goTo = this.getAttribute("href");
        window.postMessage(JSON.stringify({ type: 'logout' }));
        setTimeout(function(){
          window.location = goTo;
        }, 500);
      }

    } catch (err) {

    }
  }

  function initLogin() {
    try {
      const loginButton = document.getElementById("account-login-form")

      if (!loginButton || loginButton.isListenerAdded) {
        return
      }

      loginButton.addEventListener("submit", onLogin);
      loginButton.isListenerAdded = true

      function onLogin(event) {
        const username = document.getElementById("login_username").value;
        const password = document.getElementById("login_password").value;
        window.postMessage(JSON.stringify({ type: 'login', username, password }));
      }

    } catch (err) {
      alert(err.message)
    }
  }

  if (window.postMessage) {
      initLogin()
      initLogout()

      setInterval(() => {
          initLogin()
          initLogout()
        }, 2000)
  }
}());
`;
