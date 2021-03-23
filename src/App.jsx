import "./normalize.css";
import styled from "styled-components";
import Images from "./Images";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App() {
	return (
		<main className="App">
			<Banner>
				<BannerTitle>Stock Art</BannerTitle>
			</Banner>
			<QueryClientProvider client={queryClient}>
				<Images />
			</QueryClientProvider>
		</main>
	);
}

const Banner = styled.header`
	background-color: rgb(20 20 20);
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const BannerTitle = styled.h1`
	color: rgb(235 235 235);
	letter-spacing: 3px;
	font-family: "Lobster";
	color: white;
`;
