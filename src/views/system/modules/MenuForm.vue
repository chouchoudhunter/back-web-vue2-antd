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
        <a-form-item label="类型">
          <a-radio-group
            name="type"
            v-decorator="['type', { initialValue: 0 }]"
            button-style="solid"
            @change="onTypeChange"
          >
            <a-radio-button :value="0"> 目录 </a-radio-button>
            <a-radio-button :value="1"> 菜单 </a-radio-button>
            <a-radio-button :value="2"> 按钮 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="菜单名">
          <a-input
            v-decorator="['title', { rules: [{ required: true, max: 10, message: '请输入不超过10个字符的菜单名！' }] }]"
          />
        </a-form-item>
        <a-form-item label="权限标识">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入权限标识！' }] }]" />
        </a-form-item>
        <a-form-item label="上级菜单">
          <tree-select
            v-decorator="['pid']"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="选择上级菜单"
            :tree-data="menuData"
            treeNodeFilterProp="title"
            :replaceFields="{ title: 'title', key: 'menu_id', value: 'menu_id' }"
            allow-clear
            tree-default-expand-all
          >
          </tree-select>
        </a-form-item>
        <a-form-item label="路由地址" v-show="model.type != 2">
          <a-input v-decorator="['route_path', { rules: [{ required: true, message: '请输入路由地址！' }] }]" />
        </a-form-item>
        <a-form-item label="组件路径" v-show="model.type != 2">
          <a-input v-decorator="['component_path', { rules: [{ required: true, message: '请输入组件地址' }] }]" />
        </a-form-item>
        <a-form-item label="重定向地址" v-show="model.type === 0">
          <a-input v-decorator="['redirect']" />
        </a-form-item>
        <a-form-item label="填写图标" v-show="model.type != 2">
          <a-input v-decorator="['icon']" />
        </a-form-item>
        <a-form-item label="是都是外部链接" v-show="model.type === 1">
          <a-radio-group name="external" v-decorator="['external', { initialValue: 1 }]" button-style="solid">
            <a-radio-button :value="1"> 是 </a-radio-button>
            <a-radio-button :value="0"> 否 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否缓存" v-show="model.type === 1">
          <a-radio-group name="cache" v-decorator="['cache', { initialValue: 1 }]" button-style="solid">
            <a-radio-button :value="1"> 缓存 </a-radio-button>
            <a-radio-button :value="0"> 不缓存 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="显示状态">
          <a-radio-group name="show" v-decorator="['show', { initialValue: 1 }]" button-style="solid">
            <a-radio-button :value="1"> 显示 </a-radio-button>
            <a-radio-button :value="0"> 隐藏 </a-radio-button>
            <a-radio-button :value="2" v-show="model.type != 2"> 仅隐藏子菜单 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排序号">
          <a-input-number v-decorator="['menu_sort', { initialValue: 1 }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { TreeSelect } from 'ant-design-vue'

// 表单字段
const fields = ['type', 'name', 'title', 'external', 'pid', 'redirect', 'route_path', 'component_path', 'icon']

export default {
  components: { TreeSelect },
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
    menuData: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
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
      this.model.birth = moment(this.model.birth)
      console.log(pick(this.model, fields))
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    onTypeChange (e) {
      this.model.type = e.target.value
    }
  }
}
</script>
