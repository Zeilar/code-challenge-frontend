import { useState, useEffect } from "react";
import styled from "styled-components";
import { useInfiniteQuery } from "react-query";
import Image from "./Image";
import FullscreenImage from "./FullscreenImage";
import useOnclickOutside from "react-cool-onclickoutside";

export default function Images() {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery("images", fetchImages, {
		getNextPageParam: (lastQuery) => lastQuery.nextPage,
	});

	const [activeImage, setActiveImage] = useState();
	const [fullscreen, setFullscreen] = useState(false);

	const combinedImages = combinedImagesArray();
	const indexOfActiveImage = combinedImages.findIndex(
		(image) => image.id === activeImage?.id
	);

	function goToNextImage() {
		const nextImage = combinedImages[indexOfActiveImage + 1];
		if (nextImage) {
			setActiveImage(nextImage);
		}
	}

	function goToPreviousImage() {
		const previousImage = combinedImages[indexOfActiveImage - 1];
		if (previousImage) {
			setActiveImage(previousImage);
		}
	}

	const fullscreenContainer = useOnclickOutside(() => {
		setFullscreen(false);
		setActiveImage(null);
	});

	async function fetchImages({ pageParam = 1 }) {
		const response = await fetch(
			`https://api.unsplash.com/photos?client_id=${process.env.REACT_APP_CLIENT_ID}&page=${pageParam}&order_by=latest&per_page=20`
		);

		// API only provides pagination data via headers
		const headers = new Headers(response.headers);
		const total = parseInt(headers.get("X-Total"));
		const perPage = parseInt(headers.get("X-Per-Page"));
		const amountOfPages = Math.ceil(total / perPage);

		return {
			data: await response.json(),
			nextPage: amountOfPages > pageParam ? pageParam + 1 : false,
		};
	}

	function attemptToLoadMore() {}

	// Since every page result is in its own array, combine the arrays to see which is previous or next
	function combinedImagesArray() {
		const combined = [];
		data?.pages.forEach((page) => combined.push(...page.data));
		return combined;
	}

	function thumbnailClickHandler(image) {
		setFullscreen(true);
		setActiveImage(image);
	}

	useEffect(() => {
		document.addEventListener("scroll", attemptToLoadMore);
	}, []);

	return (
		<Wrapper>
			{fullscreen && (
				<FullscreenImage
					image={activeImage}
					forwardRef={fullscreenContainer}
					goToNextImage={goToNextImage}
					goToPreviousImage={goToPreviousImage}
				/>
			)}
			<ImagesWrapper>
				<button onClick={() => fetchNextPage()}>More</button>
				{status === "success" &&
					data.pages.map((page) =>
						page.data.map((image, i) => (
							<Image
								key={i}
								image={image}
								setActive={() => thumbnailClickHandler(image)}
							/>
						))
					)}
			</ImagesWrapper>
			{(status === "loading" || isFetchingNextPage) && <p>Loading</p>}
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
	grid-template-columns: repeat(5, 225px);
	grid-auto-rows: 150px;
	grid-gap: 15px;
	margin: 15px;
`;
