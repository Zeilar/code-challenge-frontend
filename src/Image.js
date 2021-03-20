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
	transition: transform 0.1s linear;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
	cursor: pointer;
	&:hover {
		transform: scale(1.05);
	}
`;

const GridThumbnail = styled.img`
	object-fit: cover;
	width: 100%;
	height: 100%;
`;
