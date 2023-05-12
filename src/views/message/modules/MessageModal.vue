<template>
  <a-modal
    title="添加"
    :width="900"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="标题" :labelCol="{span:2}" :wrapperCol="{span:22}">
          <a-input v-decorator="['title', { rules: [{ required: true, message: '请输入标题！' }] }]" />
        </a-form-item>
        <a-form-item label="内容" :labelCol="{span:2}" :wrapperCol="{span:22}">
          <quill-editor ref="myTextEditor" v-decorator="['content', { rules: [{ required: true }] }]" :config="editorOption"> </quill-editor>
        </a-form-item>
        <a-form-item label="通知人员" :labelCol="{span:2}" :wrapperCol="{span:22}">
          <!-- <a-input v-decorator="['front_url', { rules: [{ required: true, message: '请输入前台地址！' }] }]" /> -->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
const fields = ['title', 'content']
export default {
  components: { quillEditor },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      content: '',
      editorOption: {
        // something config
      }
    }
  },
  created () {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      // this.content = this.model.content
    })
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
 /deep/ .ql-picker-label{
  &::before{
    position: absolute;
    top: 50%;
    margin-top: -12px;
  }
}
</style>
