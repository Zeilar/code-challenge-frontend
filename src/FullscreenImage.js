import { useEffect } from "react";
import styled, { css } from "styled-components";
import { mdiArrowRight, mdiArrowLeft, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";

export default function FullscreenImage({
	image = {},
	forwardRef,
	goToPreviousImage,
	goToNextImage,
	previousImage,
	nextImage,
	close,
}) {
	function keyHandler(e) {
		if (e.key === "ArrowRight") {
			goToNextImage();
		} else if (e.key === "ArrowLeft") {
			goToPreviousImage();
		} else if (e.key === "Escape") {
			close();
		}
	}

	useEffect(() => {
		const body = document.querySelector("body");
		body.style.overflow = "hidden";
		return () => {
			body.style.overflow = null;
		};
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", keyHandler);
		return () => {
			document.removeEventListener("keydown", keyHandler);
		};
	}, [image]);

	return (
		<Wrapper ref={forwardRef}>
			<CloseButton onClick={close} />
			<PreviousButton
				onClick={goToPreviousImage}
				disabled={!Boolean(previousImage)}
			>
				Previous
			</PreviousButton>
			<Container>
				<ImageContainer>
					<Image
						src={image.urls.regular}
						title={image.alt_description}
						alt={image.alt_description}
					/>
				</ImageContainer>
				<ImageMeta></ImageMeta>
			</Container>
			<NextButton onClick={goToNextImage} disabled={!Boolean(nextImage)}>
				Next
			</NextButton>
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

const Container = styled.article`
	display: flex;
	justify-content: center;
	margin: 15px;
`;

const ImageContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const ImageMeta = styled.div``;

const Image = styled.img.attrs({ loading: "lazy" })`
	object-fit: contain;
	width: 80%;
	height: 80%;
`;

const navigationButtons = css`
	${({ disabled }) =>
		disabled &&
		`
        opacity: 0;
        pointer-events: none;
    `}
	position: absolute;
	color: rgb(235 235 235);
	width: 50px;
	height: 50px;
	cursor: pointer;
	margin: auto 0;
	transform: translateY(-50%);
	@media (max-width: 768px) {
		width: 35px;
		height: 35px;
	}
`;

const PreviousButton = styled(Icon).attrs({ path: mdiArrowLeft })`
	${navigationButtons}
	top: 50%;
	left: 200px;
	@media (max-width: 1200px) {
		left: 50px;
	}
	@media (max-width: 768px) {
		left: 15px;
	}
`;

const NextButton = styled(Icon).attrs({ path: mdiArrowRight })`
	${navigationButtons}
	top: 50%;
	right: 200px;
	@media (max-width: 1200px) {
		right: 50px;
	}
	@media (max-width: 768px) {
		right: 15px;
	}
`;

const CloseButton = styled(Icon).attrs({ path: mdiClose })`
	${navigationButtons}
	transform: none;
	right: 30px;
	top: 30px;
`;
