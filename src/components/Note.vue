<template>
  <md-content v-if="content">
    <template v-for="(cell, index) in content.cells">
      <section v-if="cell.type == 'text'" v-html="text_cell(cell.data)" :key="index" />
      <section v-else-if="cell.type == 'markdown'" :key="index">
        <vue-markdown :source="cell.data" />
      </section>
      <section v-else-if="cell.type == 'code'" v-highlight :key="index">
        <pre :class="['language-'+cell.language]">
          <code>
            {{cell.data}}
          </code>
        </pre>
      </section>
      <section v-else-if="cell.type == 'latex' && cell.language == 'latex'" :key="index">
        <latex :content="cell.data" />
      </section>
      <section v-else v-text="cell" :key="index" />
    </template>
  </md-content>
</template>

<style>
section{
  margin: 20pt auto;
}
</style>

<script>
import VueMarkdown from 'vue-markdown'
import base64 from 'base-64'
import utf8 from 'utf8'

export default {
  name: 'note',
  data() {
    return {
      content: undefined,
    }
  },
  components: {
    VueMarkdown
  },
  props: {
    repo: String,
    notebook: Object,
    meta: Object,
    onTitleListner: Function,
  },
  watch: {
    meta: function() {
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
      this.get_content()
    },
    text_cell(data) {
      data = data.replace(/<img src="quiver-image-url\/([^"]+)"/g, '<img src="https://github.com/' + this.repo + '/blob/master/'+ this.notebook.uuid + '.qvnotebook/' + this.meta.uuid + '.qvnote/resources/$1?raw=true"')
      return data
    },
    get_content() {
      this.axios.get('https://api.github.com/repos/'+ this.repo +'/contents/'+ this.notebook.uuid + ".qvnotebook/" + this.meta.uuid + ".qvnote/content.json", {
        headers: {
          Authorization: "token " + localStorage.accessToken
        }
      }).then(response => {
        this.content = JSON.parse(utf8.decode(base64.decode(response.data.content)))
        if (this.onTitleListner) {
          this.onTitleListner(this.content.title)
        }
      }).catch(err => {
        this.$toast.error({
            title: '',
            message: err
        })
      })
    }
  }
}
</script>
