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
      <el-table-column prop="alertLevel" label="告警级别 0：提醒通知 1：轻微问题 2：严重警告" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="notes" label="备注信息" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
  </el-card>
</template>

<script setup lang="ts" name="AlertAlertIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'


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


const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
