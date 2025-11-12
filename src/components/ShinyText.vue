<template>
	<!-- 字体渐变亮色 -->
	<div
		:class="classes"
		:style="styles"
	>
		{{ text }}
	</div>
</template>

<script>
export default {
	name: 'ShinyText',
	props: {
		text: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		speed: {
			type: Number,
			default: 5
		},
		className: {
			type: String,
			default: ''
		}
	},
	computed: {
		animationDuration() {
			return `${this.speed}s`;
		},
		classes() {
			return `text-[#b5b5b5a4] bg-clip-text inline-block ${!this.disabled ? 'animate-shine' : ''} ${this.className}`.trim();
		},
		styles() {
			return {
				backgroundImage:
					'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
				backgroundSize: '200% 100%',
				WebkitBackgroundClip: 'text',
				animationDuration: this.animationDuration
			};
		}
	}
};
</script>

<style scoped>
@keyframes shine {
	0% {
		background-position: 100%;
	}
	100% {
		background-position: -100%;
	}
}

.animate-shine {
	animation: shine 5s linear infinite;
}
</style>

