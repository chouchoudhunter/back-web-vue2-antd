<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="mb-2">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名">
                <a-input v-model="queryParam.name" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="服务">
                <a-select v-model="queryParam.service_id" placeholder="请选择" default-value="0">
                  <a-select-option v-for="(item,index) in serviceList" :key="index" :value="item.service_id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="menu_id"
        :columns="columns"
        :data="loadData"
        :pageSize="200"
        showPagination="auto"
      >
        <div slot="action">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">删除</a>
        </div>
      </s-table>

      <menu-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :menuData="menuList"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getMenuList, addMenu } from '@/api/system/menu'
import { getServiceList } from '@/api/service'
import MenuForm from './modules/MenuForm.vue'
import SectionTree from './components/SectionTree'
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'title'
  },
  {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '权限标识',
    dataIndex: 'name'
  },
  {
    title: '组件地址',
    dataIndex: 'component_path'
  },
  {
    title: '状态',
    dataIndex: 'show',
    align: 'center',
    customRender: (text) => {
      switch (text) {
        case 1:return '显示'
        case 2:return '隐藏子菜单'
        case 0:return '隐藏'
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
const statusMap = [
  {
    type: 0,
    text: '禁用',
    color: 'error'
  },
  {
    type: 1,
    text: '启用',
    color: 'success'
  }
]
const initMenuModel = {
  type: 0,
  show: 0
}
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    MenuForm,
    SectionTree
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: { ...initMenuModel },
      menuList: [], // 菜单列表
      serviceList: [], // 服务列表
      // 查询参数
      queryParam: { service_id: 1 },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getMenuList(requestParameters).then((res) => {
          this.menuList = res.data.data
          return res.data
        })
      },
      columns,
      expandedRowKeys: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusColorFilter (type) {
      return statusMap[type].color
    }
  },
  created () {
    console.log(1111)
    getServiceList().then(res => {
    console.log(1111, res)

      this.serviceList = res.data
    })
  },
  methods: {
    handleAdd () {
      this.mdl = { ...initMenuModel }
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
          console.log('values', values)
        if (!errors) {
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then((res) => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            values.service_id = this.queryParam.service_id
            addMenu(values).then((res) => {
              this.visible = false
              this.confirmLoading = false
              form.resetFields()
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.table-page-search-wrapper{
  /deep/ .ant-form-item{
    margin-bottom: 0;
  }
}
</style>
