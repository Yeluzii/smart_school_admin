<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="name">
        <el-input v-model="state.queryForm.name" placeholder="名称"></el-input>
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
        <el-button v-auth="'iot:group:role:batchsave'" icon="Plus" type="primary"
          @click="addBatchRoleHandle()">添加角色</el-button>
      </el-space>
    </el-space>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table"
      @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="roleCode" label="编码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit" :total="state.total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle">
    </el-pagination>
  </el-card>
</template>

<script setup lang="ts" name="SysRoleIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
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
  dataListUrl: '/sys/role/page',
  queryForm: {
    name: ''
  }
})

const queryRef = ref()
const addBatchRoleHandle = (key?: any) => {
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
      const ids = Object.values(data)
      console.log('ids', ids)
      service.post('new/iot/group/role/batchSave', { ids, groupId: props.groupId }).then(() => {
        ElMessage.success('添加成功')
      }).catch(() => {
        ElMessage.info('添加失败')
      })
    })
    .catch(() => {
      ElMessage.info('取消')
    })
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>

<style scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  line-height: normal;
  margin-left: 10px;
}
</style>
