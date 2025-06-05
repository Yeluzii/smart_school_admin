import service from '@/utils/request'

export const usePackageApi = (id: number) => {
	return service.get('new/business/package/' + id)
}

export const usePackageSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/business/package', dataForm)
	} else {
		return service.post('new/business/package', dataForm)
	}
}

export const getRoleListApi = (name: string) => {
	return service.get(`new/business/package/roleList?name=${name}`)
}
