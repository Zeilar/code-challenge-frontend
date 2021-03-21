import { useState, useEffect } from "react";
import styled from "styled-components";
import { useInfiniteQuery } from "react-query";
import Image from "./Image";
import FullscreenImage from "./FullscreenImage";
import useOnclickOutside from "react-cool-onclickoutside";
import { button } from "./styled-components";
import { mdiAlert, mdiLoading, mdiArrowDown } from "@mdi/js";
import Icon from "@mdi/react";
import { navigationButtons } from "./styled-components";

export default function Images() {
	const {
		data,
		error,
		fetchNextPage,
		isFetching,
		isFetchingNextPage,
		status,
		refetch,
	} = useInfiniteQuery("images", fetchImages, {
		getNextPageParam: (lastQuery) => lastQuery.nextPage,
	});

	const [activeImage, setActiveImage] = useState();
	const [fullscreen, setFullscreen] = useState(false);
	const [scrollToTopVisible, setScrollToTopVisible] = useState(false);

	const combinedImagesArray = mergeResultsArrays();
	const indexOfActiveImage = combinedImagesArray.findIndex(
		(image) => image.id === activeImage?.id
	);

	const nextImage = combinedImagesArray[indexOfActiveImage + 1];
	function goToNextImage() {
		if (nextImage) {
			setActiveImage(nextImage);
		}
	}

	const previousImage = combinedImagesArray[indexOfActiveImage - 1];
	function goToPreviousImage() {
		if (previousImage) {
			setActiveImage(previousImage);
		}
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	const fullscreenContainer = useOnclickOutside(() => {
		toggleFullscreen();
	});

	async function fetchImages({ pageParam = 1 }) {
		const response = await fetch(
			`https://api.unsplash.com/photos?client_id=${process.env.REACT_APP_CLIENT_ID}&page=${pageParam}&order_by=latest&per_page=20`
		);

		// API only provides pagination data via headers
		const headers = new Headers(response.headers),
			total = parseInt(headers.get("X-Total")),
			perPage = parseInt(headers.get("X-Per-Page")),
			amountOfPages = Math.ceil(total / perPage);

		return {
			data: await response.json(),
			nextPage: amountOfPages > pageParam ? pageParam + 1 : false,
		};
	}

	// Since every page result is in its own array due to React Query, combine the arrays to see which is previous or next
	function mergeResultsArrays() {
		const combined = [];
		data?.pages.forEach((page) => combined.push(...page.data));
		return combined;
	}

	function toggleFullscreen(image) {
		setFullscreen(image ? true : false);
		setActiveImage(image ? image : null);
	}

	useEffect(() => {
		function attemptToLoadMore() {
			setScrollToTopVisible(window.scrollY >= 1500 ? true : false);
			const scrollPosition = window.innerHeight + window.scrollY,
				bottomPosition = document.body.offsetHeight;
			if (scrollPosition >= bottomPosition * 0.8) {
				fetchNextPage();
			}
		}
		document.addEventListener("scroll", attemptToLoadMore);
		return () => {
			document.removeEventListener("scroll", attemptToLoadMore);
		};
	}, [fetchNextPage]);

	return (
		<Wrapper>
			{fullscreen && (
				<FullscreenImage
					image={activeImage}
					forwardRef={fullscreenContainer}
					goToNextImage={goToNextImage}
					goToPreviousImage={goToPreviousImage}
					previousImage={previousImage}
					nextImage={nextImage}
					close={() => toggleFullscreen()}
				/>
			)}
			<ImagesWrapper>
				{status === "success" &&
					combinedImagesArray.map((image, i) => (
						<Image
							key={i}
							image={image}
							setActive={() => toggleFullscreen(image)}
						/>
					))}
			</ImagesWrapper>
			{(status === "loading" || isFetchingNextPage) && <Loading />}
			{error && !isFetching && (
				<ErrorContainer>
					<ErrorHeader>
						<ErrorHeaderIcon />
						Error loading images
					</ErrorHeader>
					<ErrorButton onClick={() => refetch()}>
						Try again
					</ErrorButton>
				</ErrorContainer>
			)}
			{!fullscreen && (
				<ScrollToTop
					onClick={scrollToTop}
					className={scrollToTopVisible ? "visible" : null}
				/>
			)}
		</Wrapper>
	);
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const ImagesWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 400px);
	grid-auto-rows: 250px;
	grid-gap: 15px;
	margin: 15px;
	@media (max-width: 1200px) {
		grid-template-columns: repeat(3, 225px);
	}
	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 160px);
		grid-auto-rows: 100px;
	}
`;
const ErrorContainer = styled.div`
	margin: 50px;
	display: flex;
	flex-direction: column;
`;
const ErrorHeader = styled.h3`
	text-align: center;
	color: black;
	background-color: rgba(200, 0, 0, 0.5);
	padding: 10px 20px;
	border: 2px solid rgba(200, 0, 0, 0.25);
	font-size: 1.5rem;
	display: flex;
	align-items: center;
`;
const ErrorHeaderIcon = styled(Icon).attrs({ path: mdiAlert })`
	width: 1.5rem;
	height: 1.5rem;
	margin-right: 5px;
`;
const ErrorButton = styled.button`
	${button}
	margin-top: 10px;
	background-color: white;
	border-color: rgb(30 30 30);
	&:hover {
		background-color: rgb(30 30 30);
		color: white;
	}
`;
const Loading = styled(Icon).attrs({ path: mdiLoading, spin: 1 })`
	width: 100px;
	height: 100px;
	margin: 50px auto;
`;
const ScrollToTop = styled(Icon).attrs({ path: mdiArrowDown })`
	${navigationButtons}
	transform: rotate(-180deg); // For some reason MDI has all arrow directions but up?
	transition: 0.25s;
	bottom: 30px;
	right: 30px;
	opacity: 0;
	pointer-events: none;
	&.visible {
		pointer-events: all;
		opacity: 1;
	}
	@media (max-width: 768px) {
		bottom: 15px;
		right: 15px;
	}
`;
