<template v-if="notes">
  <md-list>
    <md-subheader v-if="subheader">
      {{subheader}}
    </md-subheader>
    <md-list-item v-for="(item, index) in metas" @click="onClick(item)" :key="index">
      <md-icon>note</md-icon>
      <span class="md-list-item-text">{{item.title}}</span>
    </md-list-item>
  </md-list>
</template>

<script>
import base64 from 'base-64'
import utf8 from 'utf8'

export default {
  name: 'notes',
  data() {
    return {
      metas: [],
    }
  },
  props: {
    repo: String,
    notebook_uuid: String,
    notes: Array,
    subheader: String,
  },
  watch: {
    notes: function() {
      this.metas = []
      this.update()
    }
  },
  mounted: function () {
    this.update()
  },
  methods: {
    onClick (val) {
      this.$emit('click', val)
    },
    update() {
      this.notes.map(note => this.get_metadata(note))
    },
    get_metadata(item) {
      this.axios.get('https://api.github.com/repos/'+ this.repo +'/contents/'+ this.notebook_uuid + ".qvnotebook/" + item.path + "/meta.json", {
        headers: {
          Authorization: "token " + localStorage.accessToken
        }
      }).then(response => {
        const data = response.data
        this.metas.push(JSON.parse(utf8.decode(base64.decode(data.content))))
      }).catch(err => {
        // console.error(err)
        this.$toast.error({
            title: '',
            message: err
        })
      })
    }
  }
}
</script>
