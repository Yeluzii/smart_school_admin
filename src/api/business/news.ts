import service from '@/utils/request'

export const useNewsApi = (id: number) => {
	return service.get('new/business/news/' + id)
}

export const useNewsSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/business/news', dataForm)
	} else {
		return service.post('new/business/news', dataForm)
	}
}
