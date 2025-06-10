<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-form-item label="告警名称" prop="alertName">
				<el-input v-model="dataForm.alertName" placeholder="告警名称"></el-input>
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :value="1">启用</el-radio>
					<el-radio :value="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="告警级别" prop="alertLevel">
				<el-select v-model="dataForm.alertLevel" placeholder="告警级别">
					<el-option label="提醒通知" :value="0"></el-option>
					<el-option label="轻微问题" :value="1"></el-option>
					<el-option label="严重警告" :value="2"></el-option>
				</el-select>
			</el-form-item>

			<!-- 设备下拉 -->
			<el-form-item label="设备" prop="deviceId">
				<el-select v-model="dataForm.deviceId" placeholder="请选择设备">
					<el-option v-for="item in deviceOptions" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item label="备注信息" prop="notes">
				<el-input v-model="dataForm.notes" placeholder="备注信息"></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAlertApi, useAlertSubmitApi } from '@/api/alert/alert'
import { getDevicesByTenantId } from '@/api/alert/alert'
import { useUserStore } from '@/store/modules/user'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false) // 控制弹窗显示
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	alertName: '',
	tenantId: 0,
	tenantName: '',
	deviceId: '',
	deviceName: '',
	status: 1,
	alertLevel: 0,
	creator: '',
	createTime: '',
	notes: '',
	updater: '',
	updateTime: '',
	version: '',
	deleted: 0
})

// 设备选项
const deviceOptions = ref([])

// 初始化方法，外部调用
const init = async (id?: number) => {
	// 获取设备
	await fetchDevices()

	if (id) {
		// 修改
		const res = await useAlertApi(id)
		if (res && res.data) {
			Object.assign(dataForm, res.data)
			// 如果没有deviceName，手动赋值
			if (!res.data.deviceName && res.data.deviceId) {
				const device = deviceOptions.value.find(item => item.id === String(res.data.deviceId))
				if (device) dataForm.deviceName = device.name
			} else {
				dataForm.deviceName = res.data.deviceName
			}
		}
	} else {
		// 新增：清空表单
		Object.assign(dataForm, {
			id: '',
			alertName: '',
			tenantId: 1,
			deviceId: '',
			deviceName: '',
			status: 1,
			alertLevel: 0,
			notes: ''
		})
	}
	// 弹出弹窗
	visible.value = true
}

// 获取设备列表
const fetchDevices = async () => {
	try {
		const userStore = useUserStore()
		const tenantId = userStore.user.tenantId || 1
		const res = await getDevicesByTenantId(tenantId)
		if (res.code === 0) {
			deviceOptions.value = res.data.map(item => ({ id: String(item.id), name: item.name }))
		} else {
			deviceOptions.value = []
		}
	} catch (err) {
		console.error('获取设备失败', err)
		deviceOptions.value = []
	}
}

// 提交
const submitHandle = async () => {
	await dataFormRef.value?.validate(async (valid: boolean) => {
		if (!valid) return

		const submitData = { ...dataForm }
		// 赋值deviceName（如果没有）
		if (!submitData.deviceName && submitData.deviceId) {
			const device = deviceOptions.value.find(item => item.id === String(submitData.deviceId))
			if (device) submitData.deviceName = device.name
		}
		// 转数字类型
		submitData.status = Number(submitData.status)
		submitData.alertLevel = Number(submitData.alertLevel)

		await useAlertSubmitApi(submitData)
		ElMessage.success('操作成功')
		// 关闭弹窗
		visible.value = false
		// 通知父组件刷新
		emit('refreshDataList')
	})
}

// 导出方法给父组件调用
defineExpose({ init })
</script>
