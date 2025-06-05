import service from '@/utils/request'

export const useGroupApi = (id: number) => {
	return service.get('/iot/group/' + id)
}

export const useGroupSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/iot/group', dataForm)
	} else {
		return service.post('/iot/group', dataForm)
	}
}