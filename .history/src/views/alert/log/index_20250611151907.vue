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
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip @selection-change="selectionChangeHandle" >
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="deviceId" label="设备id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="alertInfo" label="告警数据" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

	</el-card>
</template>

<script setup lang="ts" name="AlertLogIndex">
	import {useCrud} from '@/hooks'
	import {reactive, nextTick, ref} from 'vue'
	import {IHooksOptions} from '@/hooks/interface'
	

	const state: IHooksOptions = reactive({
	dataListUrl: '/alert/log/page',
	deleteUrl: '/alert/log',
	queryForm: {
	}
})

const queryRef = ref()


const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
