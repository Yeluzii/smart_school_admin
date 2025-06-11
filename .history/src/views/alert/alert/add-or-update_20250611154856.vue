<template>
  <el-drawer v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :size="1000">
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
      <el-form-item label="告警名称" prop="alertName">
        <el-input v-model="dataForm.alertName" placeholder="告警名称"></el-input>
      </el-form-item>
      <el-form-item label="状态 0：禁用 1：启用" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :value="0">启用</el-radio>
          <el-radio :value="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="告警级别 0：提醒通知 1：轻微问题 2：严重警告" prop="alertLevel">
        <el-select v-model="dataForm.alertLevel" placeholder="告警级别 0：提醒通知 1：轻微问题 2：严重警告">
          <el-option label="提醒通知" value="0"></el-option>
          <el-option label="轻微问题" value="1"></el-option>
          <el-option label="严重警告" value="2"></el-option>
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
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useAlertApi, useAlertSubmitApi } from '@/api/alert/alert'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
  id: '',
  alertName: '',
  tenantId: '',
  status: '',
  alertLevel: '',
  notes: '',
})

const init = (id?: number) => {
  if (id) {
    getAlert(id)
  }
}

const getAlert = (id: number) => {
  useAlertApi(id).then(res => {
    Object.assign(dataForm, res.data)
  })
}

const dataRules = ref({
  alertName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  alertLevel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }


    useAlertSubmitApi(dataForm).then(() => {
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
