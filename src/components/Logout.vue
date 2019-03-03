<template>
  <div>
    <router-link tag="a" to="/">Top</router-link>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  props: ['auth'],
  mounted: function () {
    var r = this
    firebase.auth().signOut().then(function() {
      r.auth.logout()
      localStorage.removeItem("accessToken")
      r.$router.push("/")
    })
  }
}
</script>
