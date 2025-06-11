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
	return service.get('new/iot/group/role/' + id)
}

export const useGroupRoleSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/iot/group/role', dataForm)
	} else {
		return service.post('new/iot/group/role', dataForm)
	}
}
export const deleteData = (deviceId: number, groupId: number) => {
	console.log('deviceId', deviceId)
	console.log('groupId', groupId)
	return service.delete(`new/iot/group/device/delete?deviceId=${deviceId}&groupId=${groupId}`)
}
