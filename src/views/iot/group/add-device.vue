<template>
  <el-card>
    <el-tabs>
      <el-tab-pane label="查看设备" name="devicelist">
        <DeviceList :group-id="groupId1" />
      </el-tab-pane>
      <el-tab-pane label="添加设备" name="devicegroup">
        <DeviceGroup :group-id="groupId1" />
      </el-tab-pane>
      <el-tab-pane label="查看角色" name="rolelist">
        <RoleList :group-id="groupId1" />
      </el-tab-pane>
      <el-tab-pane label="分配角色" name="rolegroup">
        <RoleGroup :group-id="groupId1" />
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
const groupId1 = ref(props.groupId)
</script>
