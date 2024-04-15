<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';

	type EChartsOption = echarts.EChartsOption;

	interface EChartProps {
		options: EChartsOption | undefined;
	}

	let { options }: EChartProps = $props();

	let containerHeight = $derived.by(() => {
		let height = 500;

		if (options?.grid) {
			if (Array.isArray(options.grid)) {
				height = (options.grid[0].height as number) + 70;
			} else {
				height = (options.grid.height as number) + 70;
			}
		}

		return height;
	});

	let eChart: echarts.ECharts;

	const chart = (node: HTMLElement, options: EChartsOption) => {
		eChart = echarts.init(node, null, {
			renderer: 'canvas'
		});

		// Do initial rendering
		eChart.setOption(options);

		return {
			// Will be called with options when the component updates
			update(options: EChartsOption) {
				eChart.resize();
				eChart.setOption(options);
			},
			destroy() {
				eChart.dispose();
			}
		};
	};

	onMount(() => {
		addEventListener('resize', (event) => {
			if (options) {
				eChart.resize();
			}
		});
	});
</script>

{#if options}
	<div use:chart={options} style="height: {containerHeight}px; width 100%;"></div>
{/if}
