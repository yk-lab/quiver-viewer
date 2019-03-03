<template v-if="folders && folders.children && folders.children.length">
  <md-list v-if="nest" slot="md-expand" :md-expand-single="true">
    <md-subheader v-if="subheader">
      {{subheader}}
    </md-subheader>
    <template v-for="(item, key, index) in folders.children">
      <md-list-item v-if="!item.children || item.children.length === 0" class="md-inset" :key="index">
        <md-icon>folder</md-icon>
        <span class="md-list-item-text" @click="onClick(item)">{{item.uuid}}</span>
      </md-list-item>
    </template>
    <template v-for="(item, key, index) in folders.children">
      <md-list-item v-if="item.children && item.children.length" class="md-inset" :key="index">
        <md-icon>folder</md-icon>
        <span class="md-list-item-text" @click="onClick(item)">{{item.uuid}}</span>

        <md-list is="notebook" :folders="item" :nest="true" slot="md-expand" @click="onClick"/>
      </md-list-item>
    </template>
  </md-list>
  <md-list v-else :md-expand-single="true">
    <md-subheader v-if="subheader">
      {{subheader}}
    </md-subheader>
    <template v-for="(item, key, index) in folders.children">
      <md-list-item v-if="!item.children || item.children.length === 0" :key="index">
        <md-icon>folder</md-icon>
        <span class="md-list-item-text" @click="onClick(item)">{{item.uuid}}</span>
      </md-list-item>
    </template>
    <template v-for="(item, key, index) in folders.children">
      <md-list-item md-expand v-if="item.children && item.children.length" :key="index">
        <md-icon>folder</md-icon>
        <span class="md-list-item-text" @click="onClick(item)">{{item.uuid}}</span>
        <md-list is="notebook" :folders="item" :nest="true" slot="md-expand" @click="onClick"/>
      </md-list-item>
    </template>
  </md-list>
</template>

<script>
// import notebook from '@/components/Notebook.vue'

export default {
  name: 'notebook',
  props: {
    folders: Object,
    nest: Boolean,
    subheader: String
  },
  methods: {
    onClick (val) {
      this.$emit('click', val)
    }
  }
}
</script>
