import styled from "styled-components";

export default function Image({ image = {}, setActive }) {
	return (
		<Wrapper onClick={setActive}>
			<GridThumbnail
				src={image.urls.thumb}
				alt={image.alt_description}
				title={image.alt_description}
			/>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	overflow: hidden;
	transition: all 0.1s linear;
	cursor: pointer;
	&:hover {
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
		transform: scale(1.05);
	}
`;

const GridThumbnail = styled.img`
	object-fit: cover;
	width: 100%;
	height: 100%;
`;
