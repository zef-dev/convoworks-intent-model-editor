export const getRandomColor = () => {
	var letters = "0123456789ABCDEF";
	var color = "#";

	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

export const preventSubmit = (e) => {
	if (e.keyCode == 13) {
		e.preventDefault();
		return false;
	}
}

export const stringToColor = (value) => {
	return value.getHashCode().intToHSL();
}

String.prototype.getHashCode = function () {
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		hash = this.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};
Number.prototype.intToHSL = function () {
	var shortened = this % 360;
	return "hsl(" + shortened + ",100%,75%)";
};

export const getColor = (index) => {
	let arr = [
		"#56ebd3",
		"#fbacf6",
		"#9ee786",
		"#e4b5ff",
		"#c2e979",
		"#20d8fd",
		"#e8d25c",
		"#42edec",
		"#f3c46f",
		"#5cefba",
		"#e8de7a",
		"#7ee8c0",
		"#e8d98c",
		"#88e99a",
		"#cfdd73",
		"#8be8ad",
		"#dff799",
		"#b5eaa1",
		"#c2d681",
		"#b5e287",
	];

	return arr[index % arr.length]
};
