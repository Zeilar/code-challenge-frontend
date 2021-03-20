import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { mdiArrowRight, mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";

export default function FullscreenImage({
	image = {},
	forwardRef,
	goToPreviousImage,
	goToNextImage,
	previousImage,
	nextImage,
}) {
	function keyHandler(e) {
		if (e.key === "ArrowRight") {
			goToNextImage();
		} else if (e.key === "ArrowLeft") {
			goToPreviousImage();
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", keyHandler);
		return () => {
			document.removeEventListener("keydown", keyHandler);
		};
	}, [image]);

	return (
		<Wrapper>
			<Container ref={forwardRef}>
				<PreviousButton onClick={goToPreviousImage}>
					Previous
				</PreviousButton>
				<ImageContainer>
					<Image
						src={image.urls.regular}
						title={image.alt_description}
						alt={image.alt_description}
					/>
					<ImageMeta></ImageMeta>
				</ImageContainer>
				<NextButton
					onClick={goToNextImage}
					disabled={!Boolean(nextImage)}
				>
					Next
				</NextButton>
			</Container>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	transform: translate(-50%, -50%);
	background-color: rgb(0, 0, 0, 0.85);
	position: fixed;
	width: 100%;
	height: 100%;
	left: 50%;
	top: 50%;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Container = styled.div`
	width: 80%;
	height: 80%;
	display: flex;
	justify-content: space-between;
`;

const ImageContainer = styled.article`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const ImageMeta = styled.div``;

const Image = styled.img.attrs({ loading: "lazy" })`
	object-fit: contain;
	max-height: 100%;
`;

const navigationButtons = css`
	${({ disabled }) => disabled && "display: none;"}
	color: rgb(235 235 235);
	width: 50px;
	height: 50px;
	cursor: pointer;
	margin: auto 0;
`;

const PreviousButton = styled(Icon).attrs({ path: mdiArrowLeft })`
	${navigationButtons}
`;

const NextButton = styled(Icon).attrs({ path: mdiArrowRight })`
	${navigationButtons}
`;
