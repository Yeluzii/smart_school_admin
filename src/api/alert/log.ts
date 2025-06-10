import service from '@/utils/request'

// 获取单条告警日志
export const useLogApi = (id: number) => {
	return service.get('/alert/log/' + id)
}

// 提交告警日志（新增/修改）
export const useLogSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/alert/log', dataForm)
	} else {
		return service.post('/alert/log', dataForm)
	}
}

// 新增：更新告警状态
export const updateLogStatusApi = (id: number, status: number) => {
	return service.put(`/alert/log/status/${id}`, null, {
		params: { status }
	})
}
