import "./normalize.css";
import styled from "styled-components";
import Images from "./Images";
import { QueryClient, QueryClientProvider } from "react-query";

const Banner = styled.header`
	background-color: rgb(25 25 25);
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const BannerTitle = styled.h1`
	color: rgb(235 235 235);
`;

const queryClient = new QueryClient();

export default function App() {
	return (
		<div className="App">
			<Banner>
				<BannerTitle>Unsplash images</BannerTitle>
			</Banner>
			<QueryClientProvider client={queryClient}>
				<Images />
			</QueryClientProvider>
		</div>
	);
}
