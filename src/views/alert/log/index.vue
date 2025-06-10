<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="alertName">
				<el-input v-model="state.queryForm.alertName" placeholder="告警名称"></el-input>
			</el-form-item>
			<el-form-item prop="alertLevel">
				<el-select v-model="state.queryForm.alertLevel" placeholder="告警级别">
					<el-option label="提醒通知" value="0"></el-option>
					<el-option label="轻微问题" value="1"></el-option>
					<el-option label="严重警告" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="status">
				<el-select v-model="state.queryForm.status" placeholder="处理状态">
					<el-option label="未处理" value="0"></el-option>
					<el-option label="已处理" value="1"></el-option>
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
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			class="layout-table"
			show-overflow-tooltip
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="alertName" label="告警名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deviceId" label="设备编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deviceName" label="设备名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="alertLevel" label="告警级别" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="getAlertLevelTagType(scope.row.alertLevel)">
						{{ getAlertLevelText(scope.row.alertLevel) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="alertTime" label="告警时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="alertInfo" label="告警数据" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="处理状态" header-align="center" align="center" width="120">
				<template #default="scope">
					<el-switch
						v-model="scope.row.status"
						:active-value="1"
						:inactive-value="0"
						:loading="scope.row.statusLoading"
						active-text="已处理"
						inactive-text="未处理"
						@change="handleStatusChange(scope.row)"
					/>
				</template>
			</el-table-column>
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
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { updateLogStatusApi } from '@/api/alert/log'

const state: IHooksOptions = reactive({
	dataListUrl: '/alert/log/page',
	deleteUrl: '/alert/log',
	queryForm: {
		alertName: '',
		alertLevel: '',
		status: ''
	}
})

const queryRef = ref()

const getAlertLevelText = level => {
	const levelMap = {
		0: '提醒通知',
		1: '轻微问题',
		2: '严重警告'
	}
	return levelMap[level] || '未知级别'
}

const getAlertLevelTagType = level => {
	const typeMap = {
		0: 'success', // 绿色 - 提醒通知
		1: 'warning', // 黄色 - 轻微问题
		2: 'danger' // 红色 - 严重警告
	}
	return typeMap[level] || 'info'
}

// 处理状态切换
// 状态切换处理
const handleStatusChange = async row => {
	row.statusLoading = true
	try {
		const response = await updateLogStatusApi(row.id, row.status)
		ElMessage.success(response.data.msg || '状态更新成功')
		// 如果需要可以刷新列表
		// getDataList()
	} catch (error) {
		// 失败时回滚状态
		row.status = row.status === 1 ? 0 : 1
		ElMessage.error(error.response?.data?.msg || '状态更新失败')
	} finally {
		row.statusLoading = false
	}
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
