import service from '@/utils/request'

export const useLogApi = (id: number) => {
	return service.get('new/alert/log/' + id)
}

export const useLogSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/alert/log', dataForm)
	} else {
		return service.post('new/alert/log', dataForm)
	}
}
