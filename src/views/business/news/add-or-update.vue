<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="内容" prop="content">
				<el-input v-model="dataForm.content" placeholder="内容"></el-input>
			</el-form-item>
			<el-form-item label="封面" prop="cover">
				<ma-upload-image v-model:image-url="dataForm.cover" :drag="true" border-radius="4px" @success="handleCoverSuccess">
					<template #empty>
						<el-icon><Picture /></el-icon>
						<span>点击或拖拽上传封面</span>
					</template>
				</ma-upload-image>
			</el-form-item>
			<el-form-item label="轮播展示" prop="banner">
				<el-radio-group v-model="dataForm.banner">
					<el-radio :value="0">不轮播</el-radio>
					<el-radio :value="1">轮播</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="发布状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :value="0">未发布</el-radio>
					<el-radio :value="1">已发布</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="置顶" prop="istop">
				<el-radio-group v-model="dataForm.istop">
					<el-radio :value="0">不置顶</el-radio>
					<el-radio :value="1">置顶</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="作者" prop="author">
				<el-input v-model="dataForm.author" placeholder="作者"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-radio-group v-model="dataForm.type">
					<el-radio :value="0">公告</el-radio>
					<el-radio :value="1">校园信息</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="标题"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useNewsApi, useNewsSubmitApi } from '@/api/business/news'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	tenantId: '',
	content: '',
	cover: '',
	banner: 0,
	status: 0,
	istop: 0,
	author: '',
	type: 0,
	title: '',
	createTime: '',
	updateTime: '',
	deleted: '',
	creator: '',
	updater: '',
	version: ''
})

const init = (id?: number) => {
	if (id) {
		getNews(id)
	}
}

const getNews = (id: number) => {
	useNewsApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	cover: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	creator: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	banner: [{ required: false, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: false, message: '必填项不能为空', trigger: 'blur' }],
	istop: [{ required: false, message: '必填项不能为空', trigger: 'blur' }],
	author: [{ required: false, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: false, message: '必填项不能为空', trigger: 'blur' }],
	title: [{ required: false, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		useNewsSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
