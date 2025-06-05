import service from '@/utils/request'

export const useGroupApi = (id: number) => {
	return service.get('new/iot/group/' + id)
}

export const useGroupSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/iot/group', dataForm)
	} else {
		return service.post('new/iot/group', dataForm)
	}
}
