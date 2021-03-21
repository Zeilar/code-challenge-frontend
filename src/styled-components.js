import { css } from "styled-components";

export const button = css`
	border: 2px solid;
	letter-spacing: 2px;
	font-weight: bold;
	text-transform: uppercase;
	padding: 10px;
`;
export const navigationButtons = css`
	position: fixed;
	color: rgb(235 235 235);
	background-color: rgba(0, 0, 0, 0.85);
	width: 50px;
	height: 50px;
	cursor: pointer;
	margin: auto 0;
	z-index: 1000;
	transform: translateY(-50%);
	&.disabled {
		opacity: 0;
		pointer-events: none;
	}
	&:focus,
	&:hover {
		outline: 2px solid rgb(235 235 235);
	}
	@media (max-width: 768px) {
		width: 35px;
		height: 35px;
	}
`;
