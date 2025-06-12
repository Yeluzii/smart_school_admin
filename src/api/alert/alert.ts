import service from '@/utils/request'

export const useAlertApi = (id: number) => {
	return service.get('new/sys/alert/' + id)
}

export const useAlertSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/sys/alert', dataForm)
	} else {
		return service.post('new/sys/alert', dataForm)
	}
}
