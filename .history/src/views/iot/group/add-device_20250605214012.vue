<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane v-auth="'iot:group:device:get'" label="设备列表" name="info">
        <DeviceList :group-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:device:save'" label="添加设备" name="info">
        <DeviceGroup :group-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:role:get'" label="角色列表" name="service">
        <RoleList :group-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:role:save'" label="分配角色" name="service">
        <RoleGroup :group-id="props.groupId" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import DeviceGroup from './device-group.vue'
import RoleGroup from './role-group.vue'
import DeviceList from './device-list.vue';
import RoleList from './role-list.vue';
const props = defineProps({
  groupId: {
    type: Number,
    required: true
  },
})
const activeName = ref('device')
</script>
