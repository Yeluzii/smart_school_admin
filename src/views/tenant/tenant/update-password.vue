<template>
	<el-dialog v-model="dialogVisible" title="修改密码">
		<el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
			<el-form-item prop="newPassword">
				<el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码"></el-input>
			</el-form-item>
			<el-form-item prop="confirmPassword">
				<el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请确认新密码"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitPassword">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { updatePasswordApi } from '@/api/tenant/tenant'

// 控制模态框显示隐藏
const dialogVisible = defineModel<boolean>('visible')

// 密码表单数据
const passwordForm = reactive({
	tenantId: 0,
	newPassword: '',
	confirmPassword: ''
})

// 密码表单引用
// 引入 FormInstance 类型
import { FormInstance } from 'element-plus'
const passwordFormRef = ref<FormInstance>()

const passwordRules = reactive({
	newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
	confirmPassword: [
		{ required: true, message: '请确认新密码', trigger: 'blur' },
		{
			// ▼ 修复：使用箭头函数确保上下文正确 ▼
			validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
				if (value !== passwordForm.newPassword) {
					callback(new Error('两次输入密码不一致'))
				} else {
					callback()
				}
			},
			trigger: ['blur', 'input']
		}
	]
})

// 提交密码修改
const submitPassword = () => {
	passwordFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			try {
				const res = await updatePasswordApi(passwordForm)
				if (res.code === 0) {
					ElMessage.success('密码修改成功')
					dialogVisible.value = false // 关闭模态框
				}
			} catch (err) {
				ElMessage.error('密码修改失败')
			}
		} else {
			ElMessage.error('请检查表单输入')
		}
	})
}

const init = (id?: number) => {
	if (id) {
		passwordForm.tenantId = id
	}
}
defineExpose({
	init
})
</script>

<style scoped></style>
