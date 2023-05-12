<template>
  <a-form-model ref="passwordInfo" :rules="rules" :model="passwordInfo" layout="horizontal">
    <a-form-model-item label="旧密码" prop="old">
      <a-input-password v-model="passwordInfo.old"></a-input-password>
    </a-form-model-item>
    <a-form-model-item label="新密码" prop="first">
      <a-input-password v-model="passwordInfo.first"></a-input-password>
    </a-form-model-item>
    <a-form-model-item label="再次输入新密码" prop="second">
      <a-input-password v-model="passwordInfo.second"></a-input-password>
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="submitForm"> 修改 </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { changePassword } from '@/api/system/user'
export default {
  components: {},
  data () {
    return {
      rules: {
        old: [
          {
            validator: (rule, value, callback) => {
              callback()
            },
            trigger: 'change'
          }
        ],
        first: [
          {
            validator: (rule, value, callback) => {
              callback()
            },
            trigger: 'change'
          }
        ],
        second: [
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordInfo.first) {
                callback(new Error('两次输入的密码不一致'))
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      passwordInfo: {
        old: '',
        first: '',
        second: ''
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['passwordInfo'].validate((valid) => {
        if (valid) {
          changePassword({ old_password: this.passwordInfo.old, new_password: this.passwordInfo.first }).then(() => {
            this.$message.info('修改成功')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
