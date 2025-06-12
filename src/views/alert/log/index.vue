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
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip
			@selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
			<el-table-column prop="name" header-align="center" align="center" label="设备名称"></el-table-column>
			<el-table-column prop="uid" label="设备id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="alertName" label="告警名称" header-align="center" align="center"></el-table-column>
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
			<el-table-column prop="createTime" label="告警时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="alertInfo" label="告警信息" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit" :total="state.total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
			@current-change="currentChangeHandle">
		</el-pagination>

	</el-card>
</template>

<script setup lang="ts" name="AlertLogIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
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
	isPage: false,
	dataListUrl: 'new/alert/log/list',
	deleteUrl: 'new/alert/log',
	queryForm: {
	}
})

const queryRef = ref()


const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
