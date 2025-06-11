import service from '@/utils/request'

export const useAlertApi = (id: number) => {
	return service.get('/sys/alert/' + id)
}

export const useAlertSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/alert', dataForm)
	} else {
		return service.post('/sys/alert', dataForm)
	}
}
