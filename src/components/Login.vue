<template>
  <div>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
    <div v-text="logged"></div>
    <!-- <router-link tag="a" to="/">Top</router-link>
    <router-link tag="a" to="/app">App</router-link>
    <router-link tag="a" to="/logout">Log out</router-link> -->
  </div>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'

export default {
  data: function() {
    return {
      logged: '',
    }
  },
  props: ['auth'],
  mounted: function () {
    // var provider = new firebase.auth.GithubAuthProvider()
    // provider.addScope('repo')
    // firebase.auth().signInWithRedirect(provider)

    var r = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        r.logged = "login済みです"
        r.auth.login()
        if (r.$route.query.redirect) {
          r.$router.push(r.$route.query.redirect)
        }
      } else {
        // No user is signed in.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', {
          callbacks: {
            signInSuccessWithAuthResult: function(authResult) { //, redirectUrl) {
              localStorage.accessToken = authResult.credential.accessToken
              r.auth.login()
              // User successfully signed in.
              // Return type determines whether we continue the redirect automatically
              // or whether we leave that to developer to handle.
              if (r.$route.query.redirect) {
                r.$router.push(r.$route.query.redirect)
              }
              return true;
            },
            uiShown: function() {
              // The widget is rendered.
              // Hide the loader.
              document.getElementById('loader').style.display = 'none';
            }
          },
          signInOptions: [
            {
              provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
              scopes: [
                'read:user,repo'
              ]
            }
          ],
          signInSuccessUrl: (r.$route.query.redirect)?r.$route.query.redirect:'/'
        })
      }
    })
  }
}
</script>
