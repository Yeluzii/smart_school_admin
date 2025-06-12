<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane v-auth="'iot:group:device:get'" label="查看设备" name="devicelist">
        <DeviceList :group-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:device:save'" label="添加设备" name="adddevice">
        <DeviceGroup :group-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:role:get'" label="查看角色" name="rolelist">
        <RoleList :group-id="props.groupId" />
      </el-tab-pane>
      <el-tab-pane v-auth="'iot:group:role:save'" label="分配角色" name="addrole">
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
