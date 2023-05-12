<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="检索部门" @change="onChange" />
    <tree
      v-model="checkedKeys"
      checkable
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :selected-keys="selectedKeys"
      :tree-data="sections"
      :replaceFields="{title:'name',key:'section_id',children:'children'}"
      @expand="onExpand"
      @select="onSelect"
      :load-data="loadData"
    />
  </div>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { getPostList } from '@/api/system/post'
export default {
  components: { Tree },
  props: {
    sections: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: []
    }
  },
  methods: {
        // 加载对应职务下的职务id
    loadData (treeNode) {
      console.log(treeNode)
      // targetOption.loading = true
      getPostList({ section_id: treeNode.section_id }).then((res) => {
        // targetOption.loading = false
        // res.data.forEach((post) => {
        //   post.section_id = post.post_id
        // })
        treeNode.dataRef.children = res.data
        this.sectionOptions = [...this.sectionOptions]
      })
    },
    onChange (e) {
      //
    },
    onExpand (expandedKeys) {
      console.log(this.sections)
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
