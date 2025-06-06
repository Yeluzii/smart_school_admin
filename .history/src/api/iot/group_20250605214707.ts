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

export const useGroupDeviceApi = (id: number) => {
	return service.get('new/iot/group/device/' + id)
}

export const useGroupDeviceSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/iot/group/device', dataForm)
	} else {
		return service.post('new/iot/group/device', dataForm)
	}
}
export const useGroupRoleApi = (id: number) => {
	return service.get('new/iot/role/device/' + id)
}

export const useGroupRoleSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/iot/role/device', dataForm)
	} else {
		return service.post('new/iot/role/device', dataForm)
	}
}
