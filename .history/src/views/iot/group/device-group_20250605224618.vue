<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="type">
        <ma-dict-select v-model="state.queryForm.type" dict-type="device_type" placeholder="设备类型"
          clearable></ma-dict-select>
      </el-form-item>
      <el-form-item prop="status">
        <ma-dict-select v-model="state.queryForm.status" dict-type="enable_disable" placeholder="设备状态"
          clearable></ma-dict-select>
      </el-form-item>
      <el-form-item prop="runningStatus">
        <ma-dict-select v-model="state.queryForm.runningStatus" dict-type="device_running_status" placeholder="运行状态"
          clearable></ma-dict-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card>
    <el-space>
      <el-space>
        <el-button v-auth="'iot:device:save'" icon="Plus" type="primary" @click="addBatchDeviceHandle()">添加设备</el-button>
      </el-space>
    </el-space>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" show-overflow-tooltip border class="layout-table"
      @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <ma-dict-column prop="status" label="状态" dict-type="enable_disable"></ma-dict-column>
      <el-table-column prop="code" label="编码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <ma-dict-column prop="type" label="设备类型" dict-type="device_type"></ma-dict-column>
      <el-table-column prop="uid" label="唯一标识码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="protocolType" label="通信协议" header-align="center" align="center"></el-table-column>
      <el-table-column prop="secret" label="设备密钥" header-align="center" align="center"></el-table-column>
      <el-table-column prop="appVersion" label="App版本" header-align="center" align="center"></el-table-column>
      <el-table-column prop="batteryPercent" label="电池电量" header-align="center" align="center">
        <template #default="scope">
          <el-progress :percentage="formatBatteryPercentage(scope.row.batteryPercent)" type="circle"
            :format="batteryFormat" :color="getBatteryColor(scope.row.batteryPercent)" :width="75" />
        </template>
      </el-table-column>

      <el-table-column prop="temperature" label="温度" header-align="center" align="center"></el-table-column>
      <ma-dict-column prop="runningStatus" label="运行状态" dict-type="device_running_status"></ma-dict-column>
      <el-table-column prop="upTime" label="最近在线时间" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit" :total="state.total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
    <el-drawer v-if="deviceDetailsVisible" v-model="deviceDetailsVisible" :title="deviceDetailsTitle" :size="1000"
      :close-on-press-escape="false">
      <device-details :device-id="deviceId" :protocol-type="protocolType"></device-details>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="IotDeviceIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { defineProps } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import service from '@/utils/request'
const props = defineProps({
  groupId: {
    type: Number,
    required: true
  }
})
const state: IHooksOptions = reactive({
  dataListUrl: '/iot/device/page',
  queryForm: {}
})

const queryRef = ref()
const addOrUpdateRef = ref()

const deviceDetailsVisible = ref(false)
const deviceDetailsTitle = ref()
const deviceId = ref()
const protocolType = ref()

const addBatchDeviceHandle = (key?: any) => {
  let data: any[] = []
  if (key) {
    data = [Number.parseInt(key)]
  } else {
    data = state.dataListSelectionKeys ? state.dataListSelectionKeys : []

    if (data.length === 0) {
      return
    }
  }

  ElMessageBox.confirm('确定进行添加操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      console.log('groupId', props.groupId)
      console.log('data', data)
      const ids = data.map((item: any) => item.value)
      console.log('ids', ids)
      service.post('new/iot/group/device/batchSave', { ids, groupId: props.groupId }).then(() => {
        ElMessage.success('添加成功')
      })
    })
    .catch(() => {
      ElMessage.info('添加失败')
    })
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const batteryFormat = (percentage: number) => {
  return percentage === 100 ? '满' : `${percentage}%`
}

const formatBatteryPercentage = (percentage: number | undefined) => {
  return percentage !== undefined ? percentage : 0
}

const getBatteryColor = (percentage: any) => {
  if (percentage >= 80) {
    return '#67C23A'
  } // Green
  if (percentage >= 60) {
    return '#409EFF'
  } // Blue
  if (percentage >= 30) {
    return '#E6A23C'
  } // Yellow
  return '#F56C6C' // Red
}
</script>
