<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="告警id" prop="alertId">
				<el-input v-model="dataForm.alertId" placeholder="告警id"></el-input>
			</el-form-item>
			<el-form-item label="告警名称" prop="alertName">
				<el-input v-model="dataForm.alertName" placeholder="告警名称"></el-input>
			</el-form-item>
			<el-form-item label="设备编号" prop="deviceId">
				<el-input v-model="dataForm.deviceId" placeholder="设备编号"></el-input>
			</el-form-item>
			<el-form-item label="设备名称" prop="deviceName">
				<el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
			</el-form-item>
			<el-form-item label="唯一标识码" prop="uid">
				<el-input v-model="dataForm.uid" placeholder="唯一标识码"></el-input>
			</el-form-item>
			<el-form-item label="告警级别" prop="alertLevel">
				<el-input v-model="dataForm.alertLevel" placeholder="告警级别"></el-input>
			</el-form-item>
			<el-form-item label="告警时间" prop="alertTime">
				<el-input v-model="dataForm.alertTime" placeholder="告警时间"></el-input>
			</el-form-item>
			<el-form-item label="告警数据" prop="alertInfo">
				<el-input v-model="dataForm.alertInfo" placeholder="告警数据"></el-input>
			</el-form-item>
			<el-form-item label="处理状态" prop="status">
				<el-input v-model="dataForm.status" placeholder="处理状态"></el-input>
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
import { useLogApi, useLogSubmitApi } from '@/api/alert/log'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	alertId: '',
	alertName: '',
	deviceId: '',
	deviceName: '',
	uid: '',
	alertLevel: '',
	alertTime: '',
	alertInfo: '',
	status: ''
})

const init = (id?: number) => {
	if (id) {
		getLog(id)
	}
}

const getLog = (id: number) => {
	useLogApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	alertId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	alertName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	deviceId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	deviceName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	uid: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	alertLevel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	alertTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	alertInfo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		useLogSubmitApi(dataForm).then(() => {
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
