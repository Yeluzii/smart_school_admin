<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="alertName">
        <el-input v-model="state.queryForm.alertName" placeholder="告警名称"></el-input>
      </el-form-item>
      <el-form-item prop="alertLevel">
        <el-select v-model="state.queryForm.alertLevel" placeholder="告警级别 0：提醒通知 1：轻微问题 2：严重警告">
          <el-option label="选择" value="0"></el-option>
        </el-select>
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
        <el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-space>
      <el-space>
        <ma-upload-file action="/sys/alert/import">
          <el-button plain icon="Upload">导入</el-button>
        </ma-upload-file>
      </el-space>
      <el-space>
        <el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
      </el-space>
    </el-space>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip
      @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="alertName" label="告警名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态 0：禁用 1：启用" header-align="center" align="center"></el-table-column>
      <el-table-column prop="alertLevel" label="告警级别" header-align="center" align="center">
        <template #default="scope">
          <!-- 添加空值检查 -->
          <el-tag v-if="scope.row" :type="getAlertTagType(scope.row.alertLevel)" effect="dark" size="medium">
            {{ getAlertLevelText(scope.row.alertLevel) }}
          </el-tag>
          <!-- 数据未加载时的占位 -->
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="notes" label="备注信息" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="primary" link @click="showAddDeviceHandle(scope.row.id)">关联设备</el-button>
          <el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit" :total="state.total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible"
      @refreshDataList="getDataList"></add-or-update>
    <el-drawer v-if="addDeviceTitle" v-model="addDeviceVisible" :title="addDeviceTitle" :size="1000"
      :close-on-press-escape="false">
      <add-device v-if="addDeviceVisible" :key="'device_' + alertId" :alert-id="alertId"></add-device>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import AddDevice from './add-device.vue'
const getAlertTagType = (level) => {
  const map = {
    0: 'success', // 绿色
    1: 'primary', // 蓝色
    2: 'danger'   // 红色
  };
  return map[level] || 'info';
}

// 获取告警级别文本
const getAlertLevelText = (level) => {
  const map = {
    0: '提醒通知',
    1: '轻微问题',
    2: '严重警告'
  };
  return map[level] || `未知级别(${level})`;
}

const state: IHooksOptions = reactive({
  dataListUrl: 'new/sys/alert/page',
  deleteUrl: 'new/sys/alert',
  queryForm: {
    alertName: '',
    alertLevel: ''
  }
})

const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
  addOrUpdateVisible.value = true
  nextTick(() => addOrUpdateRef.value.init(id))
}
const alertId = ref()
const addDeviceVisible = ref(false)
const addDeviceTitle = ref()
const showAddDeviceHandle = (id?: number) => {
  console.log('showAddDeviceHandle', id)
  alertId.value = id
  addDeviceVisible.value = true
  addDeviceTitle.value = '设备关联'
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
