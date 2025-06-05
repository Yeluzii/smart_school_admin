<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="租户名称" prop="tenantName">
				<el-input v-model="dataForm.tenantName" placeholder="租户名称"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="dataForm.username" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="dataForm.password" type="password" show-password placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item label="租户套餐" prop="packageId">
				<el-input v-model="dataForm.packageId" placeholder="租户套餐"></el-input>
			</el-form-item>
			<el-form-item label="过期时间" prop="expireTime">
				<el-input v-model="dataForm.expireTime" placeholder="过期时间"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :value="1">启用</el-radio>
					<el-radio :value="0">禁用</el-radio>
				</el-radio-group>
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useTenantApi, useTenantSubmitApi } from '@/api/tenant/tenant'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	tenantName: '',
	username: '',
	password: '',
	mobile: '',
	packageId: '',
	expireTime: '',
	status: '',
	info: '',
	creator: '',
	updater: '',
	createTime: '',
	updateTime: '',
	deleted: '',
	version: ''
})

const init = (id?: number) => {
	if (id) {
		getTenant(id)
	}
}

const getTenant = (id: number) => {
	useTenantApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	tenantName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	packageId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	expireTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	info: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		useTenantSubmitApi(dataForm).then(() => {
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
