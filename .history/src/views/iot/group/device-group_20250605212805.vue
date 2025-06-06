<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
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
        <el-button icon="Delete" plain type="danger" v-auth="'iot:group:device:delete'"
          @click="deleteBatchHandle()">批量删除</el-button>
      </el-space>
    </el-space>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip
      @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deviceId" label="设备" header-align="center" align="center"></el-table-column>
      <el-table-column prop="groupId" label="分组" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button type="primary" v-auth="'iot:group:device:delete'" link
            @click="deleteBatchHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit" :total="state.total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle">
    </el-pagination>

  </el-card>
</template>

<script setup lang="ts" name="IotGroupIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { defineProps } from 'vue';
const props = defineProps({
  groupId: {
    type: Number,
    required: true
  }
})

const state: IHooksOptions = reactive({
  dataListUrl: 'new/iot/group/device/get/' + props.groupId,
  deleteUrl: 'new/iot/group/device',
  queryForm: {
  }
})

const queryRef = ref()

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
