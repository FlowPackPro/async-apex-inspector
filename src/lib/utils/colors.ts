export default class Colors {
	static colors = [
		'00A1EO',
		'16325C',
		'76DED9',
		'08A69E',
		'E2CE7D',
		'E69F00',
		'C23934',
		'FFB75D',
		'60B17D',
		'00716B',
		'94E3B1',
		'009E73',
		'93C9F8',
		'3A93BA',
		'0070D2',
		'ABDCF4',
		'8073F7',
		'7B399C',
		'CC79A7',
		'E2B1FA',
		'AF5CD8',
		'C9CED8',
		'98A1AE',
		'656F7E',
		'000000'
	];

	// Clone Colors
	colorOptions = [...Colors.colors];
	valueToColorMap = new Map();

	static getRandomColor() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}

	getColorForValue(value: string) {
		if (this.valueToColorMap.has(value)) {
			return this.valueToColorMap.get(value);
		}

		const color = this.colorOptions.shift();

		this.valueToColorMap.set(value, color);

		// Reset the color options if we run out
		if (this.colorOptions.length === 0) {
			this.colorOptions = [...Colors.colors];
		}
	}
}
