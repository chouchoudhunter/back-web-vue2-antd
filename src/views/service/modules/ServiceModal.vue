<template>
  <a-modal
    title="添加"
    :width="640"
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
        <a-form-item label="图标">
          <a-input v-decorator="['icon', { rules: [{ required: true, message: '请输入图标名！' }] }]" />
        </a-form-item>
        <a-form-item label="服务名">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入服务名！' }] }]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            v-decorator="['desc', { rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }] }]"
          />
        </a-form-item>
        <a-form-item label="前台地址">
          <a-input v-decorator="['front_url', { rules: [{ required: true, message: '请输入前台地址！' }] }]" />
        </a-form-item>
        <a-form-item label="后台地址">
          <a-input v-decorator="['back_url', { rules: [{ required: true, message: '请输入后台地址！' }] }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
const fields = ['icon', 'name', 'desc', 'front_url', 'back_url']
export default {
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
      form: this.$form.createForm(this)
    }
  },
  created () {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
