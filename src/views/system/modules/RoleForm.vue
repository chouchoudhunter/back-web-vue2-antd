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
        <a-form-item label="角色名">
          <a-input
            v-decorator="['name', { rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }] }]"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            v-decorator="['desc', { rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }] }]"
          />
        </a-form-item>
        <a-form-item label="服务配置">
          <a-checkbox-group
            v-decorator="['services', { rules: [{ required: true, message: '请输入至少五个字符的规则描述！' }] }]"
            name="checkboxgroup"
            @change="onServiceChange"
          >
            <a-checkbox v-for="(service,index) in serviceList" :key="index" :value="service.service_id" :disabled="true">{{ service.name }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="权限配置">
          <tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :replaceFields="{ title: 'title', key: 'menu_id', children: 'children' }"
            :tree-data="menuData"
            @expand="onExpand"
            @check="onCheck"
          />
        </a-form-item>
        <a-form-item>

        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { Tree } from 'ant-design-vue'
import { getMenuList } from '@/api/system/menu'
import { getServiceList } from '@/api/service'
// 表单字段
const fields = ['name', 'desc', 'services']

export default {
  components: { Tree },
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
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      menuData: [],
      serviceList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model.birth = moment(this.model.birth)
      console.log(pick(this.model, fields))
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
    getMenuList({ pageNo: 1, pageSize: 300, service_id: 1 }).then((res) => {
      this.menuData = res.data.data
    })
    getServiceList().then(res => {
      this.serviceList = res.data
    })
  },
  methods: {
    onServiceChange (e) {
      //
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
      console.log(checkedKeys)
    }
  }
}
</script>
