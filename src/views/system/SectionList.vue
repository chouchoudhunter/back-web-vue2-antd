<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="mb-2">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" align="middle" type="flex">
            <a-col :md="8" :sm="24">
              <a-form-item label="部门名">
                <a-input v-model="queryParam.name" placeholder="" />
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
        rowKey="section_id"
        :columns="columns"
        :data="loadData"
        :pageSize="200"
        showPagination="auto"
      >
        <span slot="desc" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="deleteConfirm(record)">删除</a>
          </template>
        </span>
      </s-table>

      <section-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :sectionData="sectionList"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getSectionList, addSection, updateSection, deleteSection } from '@/api/system/section'
import { getPostList } from '@/api/system/post'
import SectionForm from './modules/SectionForm.vue'
import { Modal } from 'ant-design-vue'

const columns = [
  {
    title: '部门名',
    dataIndex: 'name'
  },
  {
    title: '创建日期',
    dataIndex: 'created_at',
    customRender: (text) => {
      return moment(text).format('yyyy-MM-DD HH:mm')
    }
  },
  {
    title: '描述',
    dataIndex: 'desc',
    scopedSlots: { customRender: 'desc' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    SectionForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      addSectionId: null,
      // 查询参数
      queryParam: { status: 1 },
      sectionList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getSectionList(requestParameters).then((res) => {
          this.sectionList = res.data.data
          return res.data
        })
      }
    }
  },
  methods: {
    // 软删除
    deleteConfirm (section) {
      Modal.confirm({
        title: `确定删除${section.name}吗？`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          deleteSection(section.section_id).then(() => {
            this.$message.info('删除成功')
            this.$refs.table.refresh()
          })
        }
      })
    },
    handleAdd () {
      this.mdl = { posts: [] }
      this.visible = true
      this.addSectionId = null
    },
    // 编辑
    handleEdit (record) {
      this.visible = true
      this.addSectionId = record.section_id
      if (!record.posts) {
        getPostList({ section_id: record.section_id, status: 1 }).then((res) => {
          record.posts = res.data
          this.mdl = { ...record }
        })
      }
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.addSectionId > 0) {
            // 修改 e.g.
            updateSection(values, this.addSectionId).then((res) => {
              console.log(res)
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            })
          } else {
            addSection(values).then(() => {
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
.table-page-search-wrapper {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
