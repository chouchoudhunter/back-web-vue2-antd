<template>
  <a-modal
    title="添加员工"
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
        <p>基本信息</p>
        <a-form-item label="部门名">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入部门名！' }] }]" />
        </a-form-item>
        <a-form-item label="上级部门">
          <tree-select
            v-decorator="['pid']"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="选择上级部门"
            :tree-data="sectionData"
            :replaceFields="{ title: 'name', key: 'section_id', value: 'section_id' }"
            allow-clear
            tree-default-expand-all
          >
          </tree-select
          ></a-form-item>
        <a-form-item label="部门描述">
          <a-input
            v-decorator="['desc', { rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }] }]"
          />
        </a-form-item>
        <a-form-item label="职务管理">
          <post-tags v-decorator="['posts']"></post-tags>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import moment from 'moment'
import PostTags from '../components/PostTags.vue'
import { TreeSelect } from 'ant-design-vue'
// 表单字段
const fields = ['name', 'posts', 'pid', 'desc']

export default {
  components: { TreeSelect, PostTags },
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
    },
    sectionData: {
      type: Array,
      default: () => []
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
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {

  }
}
</script>
