<script lang="ts">
	import { onMount } from 'svelte';
	import EChart from './EChart.svelte';
	import * as echarts from 'echarts';
	import { formatDistanceStrict, format } from 'date-fns';

	import { Colors } from '$lib/utils';

	interface ChartDataItem {
		name: string;
		value: number[];
		itemStyle: {
			color: string;
		};
	}

	let eChartOptions: echarts.EChartsOption | undefined = $state();

	let records: AsyncApexJob[];

	let isLoading = $state(true);
	let noRecords = $state(false);
	let daysToDisplay = $state('1');
	let showAllJobsRow = $state(true);
	let colorBy = $state('random');

	let buildChart = async (fetchRecords = true) => {
		isLoading = true;
		noRecords = false;

		// Get the Async apex records
		if (fetchRecords) {
			let obfuscate = new URL(document.location).searchParams.get('obfuscate');

			let res = await fetch(`/api/salesforce/query?days=${daysToDisplay}&obfuscate=${obfuscate}`, {
				method: 'GET'
			});

			records = await res.json();

			if (!res.ok) {
				console.error(records);
				window.location.href = '/logout';
			}

			// If there are no records, show a message
			if (records.length === 0) {
				noRecords = true;
			}
		}

		//  Get the min and max values for the chart range
		let min = Math.min(...records.map((record) => new Date(record.CreatedDate).getTime()));
		let max = new Date().getTime();

		// Echarts
		let eChartData: ChartDataItem[] = [];

		// Create a list of unique apex class names
		let apexClassNames = [...new Set(records.map((record) => record.ApexClass.Name))];

		// Get the longest label length
		let longestLabelLength = Math.max(...apexClassNames.map((el) => el.length));

		if (showAllJobsRow) apexClassNames.unshift('All Jobs');

		const colorHelper = new Colors();

		records.forEach((record, index) => {
			const startTime = new Date(record.CreatedDate).getTime();
			const endTime = new Date(record.CompletedDate).getTime();
			const values = [apexClassNames.indexOf(record.ApexClass.Name), startTime, endTime, index];

			const allJobValues = [0, startTime, endTime, index];

			let color = '#' + Colors.getRandomColor();

			if (colorBy === 'createdBy') {
				color = '#' + colorHelper.getColorForValue(record.CreatedBy.Name);
			}

			eChartData.push({
				name: record.ApexClass.Name,
				value: values,
				itemStyle: {
					color
				},
				record
			});

			if (showAllJobsRow) {
				eChartData.push({
					name: 'All Jobs',
					value: allJobValues,
					itemStyle: {
						color
					},
					record
				});
			}
		});

		const ROW_HEIGHT_MULTIPLIER = 22;

		eChartOptions = {
			tooltip: {
				formatter: function (params: any) {
					const record = params.data.record;

					const duration = formatDistanceStrict(params.value[2], params.value[1]);

					return (
						params.marker +
						'<strong>' +
						params.name +
						'</strong><br/> Duration: ' +
						duration +
						'<br/> Created By: ' +
						record.CreatedBy.Name
					);
				}
			},
			dataZoom: [
				{
					type: 'slider',
					filterMode: 'weakFilter',
					showDataShadow: false,
					top: apexClassNames.length * ROW_HEIGHT_MULTIPLIER + 30,
					labelFormatter: ''
				},
				{
					type: 'inside',
					filterMode: 'weakFilter'
				}
			],
			grid: {
				height: apexClassNames.length * ROW_HEIGHT_MULTIPLIER,
				left: Math.round(longestLabelLength * 7), // 7px per character (approximate)
				right: '20px',
				top: '0px',
				bottom: '0px'
			},
			xAxis: {
				min: min!,
				max: max!,
				scale: true,
				axisLabel: {
					formatter: function (val: string) {
						return format(new Date(val), 'MMM d, h:mm a');
					}
				}
			},
			yAxis: {
				data: apexClassNames,
				inverse: true
			},
			series: [
				{
					type: 'custom',
					renderItem: function (params: any, api: any) {
						let categoryIndex = api.value(0);
						let start = api.coord([api.value(1), categoryIndex]);
						let end = api.coord([api.value(2), categoryIndex]);
						let height = api.size([0, 1])[1] * 0.6;
						let rectShape = echarts.graphic.clipRectByRect(
							{
								x: start[0],
								y: start[1] - height / 2,
								width: end[0] - start[0],
								height: height
							},
							{
								x: params.coordSys.x,
								y: params.coordSys.y,
								width: params.coordSys.width,
								height: params.coordSys.height
							}
						);
						return (
							rectShape && {
								type: 'rect',
								transition: ['shape'],
								shape: rectShape,
								style: {
									fill: api.visual('color')
								}
							}
						);
					},
					encode: {
						x: [1, 2],
						y: 0
					},
					data: eChartData
				}
			]
		};

		isLoading = false;
	};

	onMount(async () => {
		buildChart();
	});
</script>

<div>
	<div class="slds-grid filters">
		<div class="slds-form-element">
			<span class="slds-form-element__label">Job Type</span>
			<div class="slds-form-element__control">
				<div class="slds-form-element__static">Batch Apex</div>
			</div>
		</div>

		<div class="slds-form-element" style="width: 100px;">
			<label class="slds-form-element__label" for="select-01">Last # of Days</label>
			<div class="slds-form-element__control">
				<div class="slds-select_container">
					<select class="slds-select" bind:value={daysToDisplay} onchange={() => buildChart()}>
						<option value="1" selected>1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
					</select>
				</div>
			</div>
		</div>

		<div class="slds-form-element" style="width: 100px;">
			<label class="slds-form-element__label" for="colorBy">Color By</label>
			<div class="slds-form-element__control">
				<div class="slds-select_container">
					<select id="colorBy" class="slds-select" bind:value={colorBy} onchange={() => buildChart(false)}>
						<option value="random" selected>Random</option>
						<option value="createdBy">Created By</option>
					</select>
				</div>
			</div>
		</div>

		<div class="slds-form-element" style="width: 120px;">
			<label class="slds-checkbox_toggle">
				<span class="slds-form-element__label slds-m-bottom_none">Show All Jobs Row</span>
				<input type="checkbox" bind:checked={showAllJobsRow} onchange={() => buildChart(false)} />
				<span id="checkbox-toggle-16" class="slds-checkbox_faux_container">
					<span class="slds-checkbox_faux"></span>
					<span class="slds-checkbox_on">Visible</span>
					<span class="slds-checkbox_off">Hidden</span>
				</span>
			</label>
		</div>
	</div>

	{#if !noRecords}
		<EChart options={eChartOptions} />
	{/if}
</div>

{#if isLoading}
	<div class="slds-spinner_container slds-is-fixed">
		<div role="status" class="slds-spinner slds-spinner_medium slds-spinner_brand">
			<span class="slds-assistive-text">Loading</span>
			<div class="slds-spinner__dot-a"></div>
			<div class="slds-spinner__dot-b"></div>
		</div>
	</div>
{/if}

{#if noRecords}
	<div class="slds-inline_icon_text slds-grid slds-m-top_small noRecords">
		<span class="slds-icon_container slds-icon-utility-announcement" title="Description of icon when needed">
			<svg class="slds-icon slds-icon-text-light slds-icon_small" aria-hidden="true">
				<use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
			</svg>
		</span>

		<div class="slds-col slds-align-middle slds-m-left_x-small">
			<p>No records were returned. Try increasing the "Last # of Days" filter.</p>
		</div>
	</div>
{/if}

<style>
	.filters {
		justify-content: center;
	}
	.filters .slds-form-element {
		margin: 0px 7px 0px 7px;
	}
	.noRecords {
		max-width: 500px;
		margin: 10px auto;
	}
</style>
