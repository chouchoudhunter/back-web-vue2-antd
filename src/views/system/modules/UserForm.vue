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
        <a-form-item label="姓名">
          <a-input
            v-decorator="['name', { rules: [{ required: true, max: 4, message: '请填写且不超过四个字符的姓名' }] }]"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-select
            v-decorator="['sex', { rules: [{ required: true, message: '请选择性别！' }] }]"
          >
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱' },{pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,message:'邮箱格式不正确'}] }]"
          />
        </a-form-item>
        <a-form-item label="手机">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '请输入手机号' },{pattern:/^1[3-9]\d{9}$/,message:'号码不正确'}] }]"
          />
        </a-form-item>
        <a-form-item label="座机">
          <a-input
            v-decorator="[
              'landline_phone',
              { rules: [{pattern:/0\d{2,3}-\d{7,8}/,message:'号码不正确'}] },
            ]"
          />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker v-decorator="['birth', { rules: [{ required: true, message: '请选择日期' }] }]" />
        </a-form-item>
        <a-form-item label="选择职务">
          <a-cascader
            v-if="!postTemp||needEditPost"
            v-decorator="['post_id' ,{ rules: [{ required: true, message: '请选择职务' }] }]"
            :options="sectionOptions"
            :load-data="loadData"
            placeholder="请选择部门和职务"
            change-on-select
            :fieldNames="{ label: 'name', value: 'section_id', children: 'children' }"
          />
          <span v-else-if="postTemp">{{ postTemp }}<a-button style="margin-left:15px" @click="changePost">修改</a-button></span>
        </a-form-item>

        <p>账号信息</p>
        <a-form-item label="密码">
          <a-input-password v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }],initialValue:123456}]" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-decorator="['roles',{ rules: [{ required: true, message: '请选择至少一个角色' }] }]" mode="multiple" :options="roleOptions" style="width: 100%" placeholder="选择角色"> </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { Cascader as ACascader } from 'ant-design-vue'
import { getPostList } from '@/api/system/post'
import { getRoleList } from '@/api/system/role'

// 表单字段
const fields = ['name', 'sex', 'email', 'phone', 'landline_phone', 'birth', 'roles']

export default {
  components: { ACascader },
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
    sectionOptions: {
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
      form: this.$form.createForm(this),
      roleOptions: [],
      postTemp: '',
      needEditPost: false
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.needEditPost = false
      this.model.birth = this.model.birth && moment(this.model.birth)
      if (this.model.postTemp) {
        this.postTemp = this.model.postTemp
      } else {
        this.fields.push('post_id')
      }
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
    getRoleList({ pageNo: 1, pageSize: 200 }).then((res) => {
      res.data.data.forEach((role) => {
        role.value = role.role_id
        role.label = role.name
      })
      this.roleOptions = res.data.data
    })
  },
  methods: {
    changePost () {
      this.needEditPost = true
    },
    // 加载对应职务下的职务id
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getPostList({ section_id: targetOption.section_id }).then((res) => {
        targetOption.loading = false
        res.data.forEach((post) => {
          post.section_id = post.post_id
        })
        targetOption.children = res.data
        this.sectionOptions = [...this.sectionOptions]
      })
    }
  }
}
</script>
