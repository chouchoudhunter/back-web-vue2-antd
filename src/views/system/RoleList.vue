<template>
  <div>
    <a-card :bordered="false" class="mb-2">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" align="middle" type="flex">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名">
                <a-input v-model="queryParam.name"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span>
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <s-table ref="table" size="default" rowKey="role_id" :columns="columns" :data="loadData">
        <!-- <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <a-row :gutter="24" :style="{ marginBottom: '12px' }">
            <a-col
              :span="12"
              v-for="(role, index) in record.permissions"
              :key="index"
              :style="{ marginBottom: '12px' }"
            >
              <a-col :span="4">
                <span>{{ role.permissionName }}：</span>
              </a-col>
              <a-col :span="20" v-if="role.actionEntitySet.length > 0">
                <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
              </a-col>
              <a-col :span="20" v-else>-</a-col>
            </a-col>
          </a-row>
        </div> -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="deleteConfirm(record)">删除</a>
        </span>
      </s-table>
    </a-card>

    <role-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    ></role-form>
  </div>
</template>

<script>
import { STable } from '@/components'
import RoleForm from './modules/RoleForm'
import { getRoleList, addRole, deleteRole } from '@/api/system/role'
import moment from 'moment'
import { Modal } from 'ant-design-vue'
export default {
  name: 'TableList',
  components: {
    STable,
    RoleForm
  },
  data () {
    return {
      confirmLoading: false,
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,

      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色名',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'desc'
        },
        {
          title: '创建人',
          dataIndex: 'created_by'
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          customRender: (text) => {
            return text ? moment(text).format('yyyy-MM-DD HH:mm') : ''
          }
          // sorter: true
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getRoleList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    deleteConfirm (role) {
      Modal.confirm({
        title: `确定删除${role.name}吗？`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          deleteRole(role.role_id).then(() => {
            this.$message.info('删除成功')
            this.$refs.table.refresh()
          })
        }
      })
    },
    handleAdd () {
      this.mdl = { services: [1] }
      this.visible = true
      // this.addSectionId = null
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.addSectionId > 0) {
            // 修改 e.g.
            // updateSection(values, this.addSectionId).then((res) => {
            //   console.log(res)
            //   this.visible = false
            //   this.confirmLoading = false
            //   // 重置表单数据
            //   form.resetFields()
            //   // 刷新表格
            //   this.$refs.table.refresh()
            //   this.$message.info('修改成功')
            // })
          } else {
            addRole(values).then(() => {
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
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
<style lang="scss" scoped>
.table-page-search-wrapper {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
