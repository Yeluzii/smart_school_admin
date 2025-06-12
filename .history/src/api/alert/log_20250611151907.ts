import service from '@/utils/request'

export const useLogApi = (id: number) => {
	return service.get('/alert/log/' + id)
}

export const useLogSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/alert/log', dataForm)
	} else {
		return service.post('/alert/log', dataForm)
	}
}