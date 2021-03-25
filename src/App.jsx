import "./normalize.css";
import styled from "styled-components";
import Images from "./Images";
import { QueryClient, QueryClientProvider } from "react-query";
import { mdiInformationOutline, mdiOpenInNew } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

const queryClient = new QueryClient();

export default function App() {
	const [bannerInfoOpen, setBannerInfoOpen] = useState(false);

	function toggleBannerInfo() {
		setBannerInfoOpen((p) => !p);
	}

	return (
		<main className="App">
			<Banner>
				<BannerTitle>Stock Art</BannerTitle>
				<BannerInfoToggler
					className={bannerInfoOpen ? "hide" : null}
					onClick={toggleBannerInfo}
				/>
				<BannerInfo className={!bannerInfoOpen ? "hide" : null}>
					Developed by Philip Angelin
					<BannerInfoLinkIcon />
				</BannerInfo>
			</Banner>
			<QueryClientProvider client={queryClient}>
				<Images />
			</QueryClientProvider>
		</main>
	);
}

const Banner = styled.header`
	background-color: rgb(20 20 20);
	padding: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;
const BannerTitle = styled.h1`
	color: rgb(235 235 235);
	letter-spacing: 3px;
	font-family: "Lobster";
	color: white;
	font-size: 3rem;
`;
const BannerInfoToggler = styled(Icon).attrs({ path: mdiInformationOutline })`
	transition: 0.1s linear;
	width: 25px;
	height: 25px;
	color: white;
	cursor: pointer;
	position: absolute;
	right: 15px;
	top: 15px;
	&.hide {
		pointer-events: none;
		opacity: 0;
	}
`;
const BannerInfo = styled.a.attrs({
	href: "https://github.com/Zeilar",
	target: "_blank",
})`
	transition: right 0.1s linear, opacity 0.1s linear;
	position: absolute;
	text-decoration: none;
	color: white;
	cursor: pointer;
	top: 15px;
	right: 15px;
	&.hide {
		right: 0;
		pointer-events: none;
		opacity: 0;
	}
	&:hover {
		color: rgb(0 127 255);
	}
`;
const BannerInfoLinkIcon = styled(Icon).attrs({ path: mdiOpenInNew })`
	width: 1.25rem;
	height: 1.25rem;
	vertical-align: middle;
	margin-left: 5px;
`;
