<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="分组名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="分组名称"></el-input>
			</el-form-item>
			<!-- <el-form-item label="" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder=""></el-input>
  </el-form-item> -->
			<!-- <el-form-item label="" prop="updator">
      <el-input v-model="dataForm.updator" placeholder=""></el-input>
  </el-form-item> -->
			<!-- <el-form-item label="" prop="orgId">
      <el-input v-model="dataForm.orgId" placeholder=""></el-input>
  </el-form-item> -->
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
import { useGroupApi, useGroupSubmitApi } from '@/api/iot/group'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	name: '',
	tenantId: 1,
	info: ''
})

const init = (id?: number) => {
	if (id) {
		getGroup(id)
	}
}

const getGroup = (id: number) => {
	useGroupApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	info: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}


		useGroupSubmitApi(dataForm).then(() => {
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
