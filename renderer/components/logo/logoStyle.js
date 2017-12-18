import * as globalStyles from '../../globalStyles';

export const svg = `
	margin-left: 10px;
	margin-top: 10px;
`;

export const boundingSquare = `
	stroke: ${globalStyles.accent};
	fill-opacity: 0;
`;

export const droplet = `
	filter:url('#dropletFilter');
`

export const smallDroplet1 = `
	fill: ${globalStyles.accent};
`;

export const smallDroplet2 = `
	fill: ${globalStyles.accent};
`;

export const largeDroplet = `
	fill: ${globalStyles.accent};
`;

export const container = `
	background-color: ${globalStyles.secondary};
	width: 100vw;
	height: 100vh;
	margin-left: -8px;
	margin-top: -8px;
`;

export const bleh = `
	color: red;
	animation-name: largeDropletAnimation;
  animation-duration: 4s;
  animation-direction: forward;
`;