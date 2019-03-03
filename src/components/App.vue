<template>
  <div class="page-container md-layout-row">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">{{note_title}}</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-button @click="choiceRepo">
            {{object.name}}
          </md-button>
        </md-toolbar>

        <div class="full-control">
          <md-list is="notebook"
              v-if="folders && folders.children && folders.children.length"
              :folders="folders" :md-expand-single="true"
              subheader="Notebooks"
              @click="click_notebook" />
          <md-list is="notes"
              v-if="note_list"
              :repo="object.name"
              :notebook_uuid="now_notebook.uuid"
              :notes="note_list"
              subheader="Notes"
              @click="click_notename" />
        </div>
      </md-app-drawer>

      <md-app-content>
        <note
          v-if="note_meta"
          :repo="object.name"
          :notebook="now_notebook"
          :meta="note_meta"
          :onTitleListner="this.set_title"/>
      </md-app-content>
    </md-app>
    <md-dialog :md-active.sync="choiceRepoModal">
      <md-dialog-title>リポジトリ選択</md-dialog-title>

      <md-dialog-content class="md-scrollbar">
        <md-list>
          <md-list-item v-for="(reponame, index) in reponames" @click="methodToRunOnSelect(reponame)" :key="index">
            {{reponame.name}}
          </md-list-item>
        </md-list>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
// import dropdown from 'vue-dropdowns'
import base64 from 'base-64'
import utf8 from 'utf8'
import notebook from '@/components/Notebook.vue'
import notes from '@/components/Notes.vue'
import note from '@/components/Note.vue'

export default {
  name: 'App',
  data() {
    return {
      reponames: [],
      object: {
        name: undefined,
      },
      placeholderText: 'リポジトリを選択',
      choiceRepoModal: true,
      folders: undefined,
      note_list: undefined,
      root: true,
      uuid2sha: undefined,
      now_notebook: undefined,
      note_meta: undefined,
      note_title: undefined,
    }
  },
  components: {
    'notebook': notebook,
    'notes': notes,
    'note': note,
  },
  mounted: function () {
    let r = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // console.debug(user);
        // User is signed in.
        r.axios.get('https://api.github.com/user/repos', {
          params: {
            visibility: 'all',
          },
          headers: {
            Authorization: "token " + localStorage.accessToken
          }
        }).then(response => {
          const data = response.data
          // console.debug('status:', response.status); // 200
          // console.debug('body:', data);     // response body.

          r.reponames = data.map(item => ({'name': item.full_name, 'id': item.id}))
        }).catch(err => {
          // console.error('err:', err);
          this.$toast.error({
              title: '',
              message: err
          })
        })
      } else {
        r.$router.push("/login?redirect=/app")
      }
    })
  },
  methods: {
    set_title(title){
      this.note_title = title
    },
    click_notename(item) {
      this.note_meta = item
    },
    click_notebook(item) {
      this.now_notebook = item
      const sha = this.uuid2sha.filter(i => i.name == item.uuid + ".qvnotebook")[0].sha
      this.axios.get('https://api.github.com/repos/'+ this.object.name +'/git/trees/'+ sha, {
        headers: {
          Authorization: "token " + localStorage.accessToken
        }
      }).then(response => {
        const data = response.data
        // console.log('status:', response.status); // 200
        // console.log('body:', data);     // response body.
        this.note_list = data.tree.filter(i => /\.qvnote$/.test(i.path))
        // console.log(this.note_list)
      }).catch(err => {
        // console.error('err:', err);
        this.$toast.error({
            title: '',
            message: err
        })
      })
    },
    // get_notebook_info(item) {
    //   this.axios.get('https://api.github.com/repos/'+ this.object.name +'/contents/'+ item.uuid + '.qvnotebook/meta.json', {
    //     headers: {
    //       Authorization: "token " + localStorage.accessToken
    //     }
    //   }).then(response => {
    //     const data = response.data
    //     const meta = JSON.parse(utf8.decode(base64.decode(data.content))) // Name, UUID
    //   }).catch(err => {
    //     // console.error('err:', err);
    //     this.$toast.error({
    //         title: '',
    //         message: err
    //     })
    //   })
    // },
    methodToRunOnSelect(payload) {
      this.object = payload
      this.update_repo()
      this.choiceRepoModal = false
    },
    choiceRepo() {
      this.choiceRepoModal = true
    },
    update_repo() {
      // Notebook List
      this.axios.get('https://api.github.com/repos/'+ this.object.name +'/contents/meta.json', {
        headers: {
          Authorization: "token " + localStorage.accessToken
        }
      }).then(response => {
        const data = response.data
        // console.log('status:', response.status); // 200
        // console.log('body:', data);     // response body.
        this.folders = JSON.parse(utf8.decode(base64.decode(data.content)))
      }).catch(err => {
        // console.error('err:', err);
        this.$toast.error({
            title: '',
            message: err
        })
      })

      // Notebook directory's sha
      this.axios.get('https://api.github.com/repos/'+ this.object.name +'/contents', {
        headers: {
          Authorization: "token " + localStorage.accessToken
        }
      }).then(response => {
        const data = response.data
        // console.log('status:', response.status); // 200
        // console.log('body:', data);     // response body.
        this.uuid2sha = data
      }).catch(err => {
        // console.error('err:', err)
        this.$toast.error({
            title: '',
            message: err
        })
      })

    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
    min-height: 350px;
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-dialog {
    max-width: 768px;
  }

  $list-width: 320px;

  .full-control {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
  }

  .list {
    width: $list-width;
  }

  .full-control > .md-list {
    width: $list-width;
    max-width: 100%;
    // height: 400px;
    display: inline-block;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
    vertical-align: top;
  }
</style>
