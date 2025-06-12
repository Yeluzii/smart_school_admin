<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="name">
				<el-input v-model="state.queryForm.name" placeholder="分组名称"></el-input>
			</el-form-item>
			<el-form-item prop="tenantId">
				<el-input v-model="state.queryForm.tenantId" placeholder="机构"></el-input>
			</el-form-item>
			<el-form-item prop="info">
				<el-input v-model="state.queryForm.info" placeholder="备注"></el-input>
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
				<el-button icon="Plus" type="primary" v-auth="'iot:group:save'" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip
			@selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="分组名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tenantId" label="机构" header-align="center" align="center"></el-table-column>
			<el-table-column prop="info" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" v-auth="'iot:group:update'" link
						@click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" v-auth="'iot:group:device:page'" link
						@click="addDeviceHandle(scope.row.id)">添加设备</el-button>
					<el-button type="primary" v-auth="'iot:group:delete'" link
						@click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="IotGroupIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'


const state: IHooksOptions = reactive({
	dataListUrl: 'new/iot/group/page',
	deleteUrl: 'new/iot/group',
	queryForm: {
		name: '',
		tenantId: '',
		info: ''
	}
})
const groupId = ref()
const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}
const addDeviceHandle = (id?: number) => {
	groupId.value = id
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
