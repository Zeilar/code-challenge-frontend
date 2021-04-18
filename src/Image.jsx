import styled from "styled-components";

export default function Image({ image = {}, setActive, ...props }) {
	return (
		<Wrapper onClick={setActive} {...props}>
			<GridThumbnail
				src={image.urls.small} // Wanted to use thumb size but it seems Unsplash only allows up to ~30 images per page
				alt={image.alt_description}
				title={image.alt_description}
			/>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	@keyframes fade {
		from {
			transform: translateY(15px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	animation: fade 0.5s ease-out forwards;
	overflow: hidden;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
	cursor: pointer;
`;
const GridThumbnail = styled.img.attrs({ loading: "lazy" })`
	object-fit: cover;
	transition: 0.25s;
	width: 100%;
	height: 100%;
	&:hover {
		transform: scale(1.1);
	}
`;
