<template>
  <page-header-wrapper class="user-list">
    <a-row :gutter="24">
      <a-col :span="6">
        <a-card :bordered="false">
          <div slot="title">部门筛选</div>
          <section-tree :sections="sections"></section-tree>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-card :bordered="false" class="mb-2">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="姓名">
                    <a-input v-model="queryParam.name" placeholder="" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="手机号">
                    <a-input v-model="queryParam.phone" placeholder="" />
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="在职状态">
                      <a-select v-model="queryParam.status" placeholder="请选择">
                        <a-select-option :value="-1">离职</a-select-option>
                        <a-select-option :value="1">在职</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="邮件">
                      <a-input v-model="queryParam.email" placeholder="" />
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="入职日期">
                      <a-date-picker v-model="queryParam.created_at" style="width: 100%" placeholder="请输入更新日期" />
                    </a-form-item>
                  </a-col>
                </template>
                <a-col :md="(!advanced && 8) || 24" :sm="24">
                  <span
                    class="table-page-search-submitButtons"
                    :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                  >
                    <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                    <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                      {{ advanced ? '收起' : '展开' }}
                      <a-icon :type="advanced ? 'up' : 'down'" />
                    </a>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
          </div>
        </a-card>
        <a-card :bordered="false">
          <s-table
            ref="table"
            size="default"
            rowKey="user_id"
            :columns="columns"
            :data="loadData"
            :pageURI="true"
            showPagination="auto"
          >
            <span slot="section_post" slot-scope="text, record">
              <span :class="{ 'delete-line': record.post.section.status == -1 }">{{ record.post.section.name }}</span
              >-<span :class="{ 'delete-line': record.post.status == -1 || record.post.section.status == -1 }">{{
                record.post.name
              }}</span>
            </span>
            <span slot="status" slot-scope="text">
              <a-badge v-if="text == 1" status="success" text="在职" />
              <a-badge v-else-if="text == -1" status="error" text="离职" />
            </span>
            <span slot="description" slot-scope="text">
              <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
            </span>

            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="handleEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a @click="handleDelete(record)">离职</a>
              </template>
            </span>
          </s-table>

          <user-form
            ref="createModal"
            :visible="visible"
            :loading="confirmLoading"
            :model="mdl"
            :sectionOptions="sections"
            @cancel="handleCancel"
            @ok="handleOk"
          />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getUserList, addUser, deleteUser, updateUser } from '@/api/system/user'
import { getSectionList } from '@/api/system/section'
import UserForm from './modules/UserForm'
import SectionTree from './components/SectionTree'
import { Modal } from 'ant-design-vue'
const columns = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '部门及职务',
    scopedSlots: { customRender: 'section_post' }
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '入职时间',
    dataIndex: 'created_at',
    sorter: true,
    customRender: (text) => {
      return moment(text).format('yyyy-MM-DD HH:mm')
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    UserForm,
    SectionTree
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getUserList(requestParameters).then((res) => {
          return res.data
        })
      },
      updateUserId: null,
      sections: []
    }
  },
  created () {
    getSectionList({ status: 1, pageNo: 1, pageSize: 200 }).then((res) => {
      this.sections = res.data.data
    })
  },
  methods: {
    // 用户离职（软删除）
    handleDelete (user) {
      Modal.confirm({
        title: `确定为${user.name}办理离职吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteUser(user.user_id).then(() => {
            this.$message.info('离职完成')
            this.$refs.table.refresh()
          })
        }
      })
    },
    handleAdd () {
      this.updateUserId = null
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.updateUserId = record.user_id
      const recordTemp = { ...record }
      // 修改为保证职务选择框正确显示
      recordTemp.postTemp = recordTemp.post.section.name + '/' + recordTemp.post.name
      // 复原roles
      recordTemp.roles = recordTemp.roles.map((role) => {
        return role.role_id
      })
      this.mdl = recordTemp
    },
    // 添加确认按钮
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.updateUserId > 0) {
            if (values.post_id)values.post_id = values.post_id[values.post_id.length - 1]
            values.birth = values.birth.format('YYYY-MM-DD HH:mm:ss')
            console.log(values)
            // 修改 e.g.
            updateUser(values, this.updateUserId).then((res) => {
              this.visible = false
              this.confirmLoading = false
              form.resetFields()
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            })
          } else {
            values.post_id = values.post_id[values.post_id.length - 1]
            values.birth = values.birth.format('YYYY-MM-DD HH:mm:ss')
            // 新增
            addUser(values)
              .then((res) => {
                this.visible = false
                this.confirmLoading = false
                form.resetFields()
                this.$refs.table.refresh()
                this.$message.info('新增成功')
              })
              .catch(() => {
                this.confirmLoading = false
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
    toggleAdvanced () {
      this.advanced = !this.advanced
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
</style>
