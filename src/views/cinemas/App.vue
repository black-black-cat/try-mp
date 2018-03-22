<template>
	<div>
		<app-header :options="options"></app-header>
		<app-content :options="options"></app-content>
	</div>
</template>

<script>
	import AppHeader from "./Header";
	import AppContent from "./Content";
    import {array, object} from 'common/utils/defaultProps'

	export default {
	    props: {
			options: object
	    },
		components: {
            AppHeader,
            AppContent
		},
		data() {
	        return{}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/style/mixin';
</style>