<template>
  <div>
    <template v-for="(post, index) in postList">
      <a-tag v-if="post.status==1" :key="index" :closable="true" @close="handleClose(post)">
        {{ post.name }}
      </a-tag>
    </template>
    <a-input
      v-if="inputVisible"
      ref="input"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      :value="inputValue"
      @change="handleInputChange"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else style="background: #fff; borderstyle: dashed" @click="showInput">
      <a-icon type="plus" /> 添加职务
    </a-tag>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: Array
    }
  },
  data () {
    return {
      // postList: this.value,
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    postList () {
      return this.value
    }
  },
  methods: {
    handleClose (removedPost) {
      this.postList.forEach((post, index) => {
        if (post.name === removedPost.name) {
          this.postList[index].status = -1
        }
      })
    },
    // 显示输入框
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    // 添加职务
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue && this.postList.indexOf(inputValue) === -1) {
        this.postList.push({ 'section_id': 0, 'name': inputValue, 'status': 1 })
        this.$emit('input', this.postList)
        this.inputVisible = false
        this.inputValue = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
