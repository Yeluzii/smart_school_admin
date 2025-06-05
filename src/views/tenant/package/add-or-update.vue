<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="套餐名称" prop="packageName">
				<el-input v-model="dataForm.packageName" placeholder="套餐名称"></el-input>
			</el-form-item>
			<el-form-item label="关联角色" prop="roleId">
				<!-- 修改后的角色下拉框 -->
				<el-select v-model="dataForm.roleId" placeholder="请选择角色" clearable>
					<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="info">
				<el-input v-model="dataForm.info" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus/es'
import { usePackageApi, usePackageSubmitApi, getRoleListApi } from '@/api/tenant/package'

const emit = defineEmits(['refreshDataList'])

// 修改：添加角色列表响应变量
const roleList = ref<any[]>([])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	packageName: '',
	roleId: '',
	info: '',
	creator: '',
	updater: '',
	createTime: '',
	updateTime: '',
	deleted: ''
})

// 修改：添加获取角色列表的方法
const getRoleList = async () => {
	try {
		const res = await getRoleListApi('')
		if (res.code === 0) {
			roleList.value = res.data
		} else {
			ElMessage.error(res.msg || '获取角色列表失败')
		}
	} catch (error) {
		ElMessage.error('请求角色列表异常')
	}
}

const init = (id?: number) => {
	// 每次打开弹窗时获取角色列表
	getRoleList()

	if (id) {
		getPackage(id)
	} else {
		// 新增时清空表单
		Object.keys(dataForm).forEach(key => {
			if (key !== 'id') {
				dataForm[key] = ''
			}
		})
	}
}

const getPackage = (id: number) => {
	usePackageApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	packageName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	roleId: [{ required: true, message: '请选择关联角色', trigger: 'change' }], // 修改验证触发方式
	info: [{ required: false, message: '请输入备注信息', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		usePackageSubmitApi(dataForm).then(() => {
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
