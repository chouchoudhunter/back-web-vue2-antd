<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="#" target="_blank"></a>
      <a href="#" target="_blank">成都夸克光电技术有限公司</a>
    </template>
    <template v-slot:copyright>
      <!-- <a href="#" target="_blank">成都夸克光电技术有限公司</a> -->
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
