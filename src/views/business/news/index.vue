<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<!-- 轮播展示筛选 -->
			<el-form-item prop="banner">
				<el-select v-model="state.queryForm.banner" placeholder="轮播展示" clearable>
					<el-option label="轮播" :value="1" />
					<el-option label="不轮播" :value="0" />
				</el-select>
			</el-form-item>

			<!-- 发布状态筛选 -->
			<el-form-item prop="status">
				<el-select v-model="state.queryForm.status" placeholder="发布状态" clearable>
					<el-option label="已发布" :value="1" />
					<el-option label="未发布" :value="0" />
				</el-select>
			</el-form-item>

			<!-- 置顶筛选 -->
			<el-form-item prop="istop">
				<el-select v-model="state.queryForm.istop" placeholder="置顶状态" clearable>
					<el-option label="置顶" :value="1" />
					<el-option label="不置顶" :value="0" />
				</el-select>
			</el-form-item>

			<!-- 类型筛选 -->
			<el-form-item prop="type">
				<el-select v-model="state.queryForm.type" placeholder="内容类型" clearable>
					<el-option label="校园信息" :value="1" />
					<el-option label="公告" :value="0" />
				</el-select>
			</el-form-item>

			<!-- 查询和重置按钮 -->
			<el-form-item>
				<el-button icon="Search" type="primary" v-auth="'business:news:get'" @click="getDataList()">查询</el-button>
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
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			class="layout-table"
			show-overflow-tooltip
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="content" label="内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="cover" label="封面" header-align="center" align="center">
				<template #default="scope">
					<el-image
						v-if="scope.row.cover"
						style="width: 60px; height: 40px; border-radius: 4px"
						:src="scope.row.cover"
						:preview-src-list="[scope.row.cover]"
						fit="cover"
					/>
					<span v-else>无封面</span>
				</template>
			</el-table-column>
			<el-table-column prop="banner" label="轮播展示" dict-type="yes_no" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.banner === 1 ? 'success' : 'info'">
						{{ scope.row.banner === 1 ? '轮播' : '不轮播' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="发布状态" dict-type="publish_status" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
						{{ scope.row.status === 1 ? '已发布' : '未发布' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="istop" label="置顶" dict-type="yes_no" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.istop === 1 ? 'danger' : 'info'">
						{{ scope.row.istop === 1 ? '置顶' : '不置顶' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="author" label="作者" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="类型" dict-type="content_type" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.type === 1 ? 'primary' : 'success'">
						{{ scope.row.type === 1 ? '校园信息' : '公告' }}
					</el-tag>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="type" label="类型" header-align="center" align="center">
				<template #default="scope">
					{{ scope.row.type === '0' ? '公告' : '校园信息' }}
				</template>
			</el-table-column> -->
			<el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link v-auth="'business:news:update'" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="BusinessNewsIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { useRouterStore } from '@/store/modules/router'
const state: IHooksOptions = reactive({
	dataListUrl: 'new/business/news/page',
	deleteUrl: 'new/business/news',
	queryForm: {
		banner: undefined, // 轮播展示：1=轮播，0=不轮播
		status: undefined, // 发布状态：1=已发布，0=未发布
		istop: undefined, // 置顶状态：1=置顶，0=不置顶
		type: undefined // 内容类型：1=校园信息，0=公告
	}
})

const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}

const {
	getDataList: originalGetDataList,
	selectionChangeHandle,
	sizeChangeHandle,
	currentChangeHandle,
	deleteBatchHandle,
	downloadHandle,
	reset
} = useCrud(state)

const getDataList = () => {
	// 构建查询参数（过滤undefined值）
	const queryParams = {
		...Object.fromEntries(Object.entries(state.queryForm).filter(([_, v]) => v !== undefined)),
		page: state.page,
		limit: state.limit
	}

	console.log('查询参数:', queryParams) // 调试用
	originalGetDataList(queryParams)
}
</script>
