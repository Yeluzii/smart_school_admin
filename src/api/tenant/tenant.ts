import service from '@/utils/request'

export const useTenantApi = (id: number) => {
	return service.get('new/business/tenant/' + id)
}

export const useTenantSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/business/tenant', dataForm)
	} else {
		return service.post('new/business/tenant', dataForm)
	}
}

export const getPackageListApi = (name: string) => {
	return service.get(`new/business/package/packageList?name=${name}`)
}

export const updatePasswordApi = (dataForm: any) => {
	return service.post('new/business/tenant/password', dataForm)
}
