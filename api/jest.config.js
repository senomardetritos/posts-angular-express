module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node', // or 'jsdom' for browser environments
	coveragePathIgnorePatterns: [
		'<rootDir>/dist/',
		'<rootDir>/node_modules/', // Generally good practice to exclude node_modules too
	],
};
