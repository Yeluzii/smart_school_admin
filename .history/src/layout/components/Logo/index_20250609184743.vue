<template>
	<div v-if="appStore.sidebarOpened" class="sidebar-logo">
		<el-avatar src="/favicon.ico"></el-avatar>
		<span class="logo-title"> {{ $t(logoText) }}</span>
	</div>
	<div v-else class="sidebar-logo sidebar-logo-expend">
		<span>{{ $t('app.miniLogoText') }}</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user';
const appStore = useAppStore()
const userStore = useUserStore();
const logoText = computed(() => {
	return userStore.user.roleIdList.includes(1) ? 'app.logoSuperAdminText' : 'app.logoTenantAdminText'
})
</script>

<style lang="scss" scoped>
.sidebar-logo {
	width: 230px !important;
	height: var(--theme-header-height);
	line-height: var(--theme-header-height);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0 1px 4px;
	color: var(--theme-logo-text-color);
	font-size: 18px;

	//overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	.el-avatar {
		width: 25px;
		height: 25px;
	}

	.logo-title {
		margin-left: 10px;
	}
}

.sidebar-logo-expend {
	width: 100% !important;
}
</style>
