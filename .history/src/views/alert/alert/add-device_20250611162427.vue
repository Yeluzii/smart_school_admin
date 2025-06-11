<template>
  <el-card>
    <el-tabs>
      <el-tab-pane label="查看设备" name="devicelist">
        <DeviceList :group-id="alertId1" />
      </el-tab-pane>
      <el-tab-pane label="关联设备" name="devicegroup">
        <DeviceGroup :group-id="alertId1" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import DeviceGroup from './device-group.vue'
import DeviceList from './device-list.vue';
const props = defineProps({
  alertId: {
    type: Number,
    required: true
  },
})
const alertId1 = ref(props.alertId)
</script>
