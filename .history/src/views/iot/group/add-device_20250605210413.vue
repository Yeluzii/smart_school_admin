<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane v-auth="'iot:group:device:page'" label="添加设备" name="info">
        <DeviceGroup :device-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:role:page'" label="分配角色" name="service">
        <RoleGroup :device-id="props.groupId" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
const props = defineProps({
  groupId: {
    type: Number,
    required: true
  },
})
const activeName = ref('device')
</script>
