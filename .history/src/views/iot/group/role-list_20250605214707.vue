<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { defineProps } from 'vue';
const props = defineProps({
  groupId: {
    type: Number,
    required: true
  }
})

const state: IHooksOptions = reactive({
  dataListUrl: 'new/iot/group/device/' + props.groupId,
  deleteUrl: 'new/iot/group/device',
  queryForm: {
  }
})

const queryRef = ref()

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
