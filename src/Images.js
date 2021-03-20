import { useState, useEffect } from "react";
import styled from "styled-components";
import { useInfiniteQuery } from "react-query";
import Image from "./Image";

export default function Images() {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery("images", fetchImages, {
		getNextPageParam: (lastQuery) => lastQuery.nextPage,
	});

	const [activeImage, setActiveImage] = useState();
	const indexOfActiveImage = combinedImagesArray().findIndex(
		(image) => image.id === activeImage?.id
	);
	const nextImage = combinedImagesArray()[indexOfActiveImage + 1];
	const previousImage = combinedImagesArray()[indexOfActiveImage - 1];

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

	useEffect(() => {
		document.addEventListener("scroll", attemptToLoadMore);
	}, []);

	// console.log(
	// 	data?.pages,
	// 	hasNextPage,
	// 	status,
	// 	isFetching,
	// 	isFetchingNextPage
	// );
	// console.log(activeImage);

	return (
		<Wrapper>
			<ImagesWrapper>
				<button onClick={() => fetchNextPage()}>More</button>
				{status === "success" &&
					data.pages.map((page) =>
						page.data.map((image, i) => (
							<Image
								key={i}
								image={image}
								setActive={() => setActiveImage(image)}
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
