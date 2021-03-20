import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { mdiArrowRight, mdiArrowLeft, mdiClose, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import useImage from "./useImage";

export default function FullscreenImage({
	image = {},
	forwardRef,
	goToPreviousImage,
	goToNextImage,
	previousImage,
	nextImage,
	close,
}) {
	const { loaded, fetching } = useImage(image.urls.regular);

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

	const imageElement = useRef();

	return (
		<Wrapper>
			<CloseButton onClick={close} />
			<ImageContainer ref={forwardRef}>
				<PreviousButton
					onClick={goToPreviousImage}
					disabled={!Boolean(previousImage)}
				>
					Previous
				</PreviousButton>
				{fetching && <Loading />}
				{loaded && (
					<>
						<Image
							src={image.urls.regular}
							title={image.alt_description}
							alt={image.alt_description}
							ref={imageElement}
						/>
						<ImageMeta>
							<ImagePostedBy>
								Posted by <b>{image.user.username}</b> on &nbsp;
								<AuthorLink href={image.links.html}>
									Unsplash
								</AuthorLink>
							</ImagePostedBy>
						</ImageMeta>
					</>
				)}
				<NextButton
					onClick={goToNextImage}
					disabled={!Boolean(nextImage)}
				>
					Next
				</NextButton>
			</ImageContainer>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: rgba(0, 0, 0, 0.75);
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 100;
	top: 0;
	left: 0;
`;

const ImageContainer = styled.article`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
`;

const ImageMeta = styled.div`
	position: absolute;
	width: 100%;
`;

const ImagePostedBy = styled.p`
	padding: 15px;
	color: rgb(235 235 235);
	background-color: rgba(0, 0, 0, 0.75);
`;

const Image = styled.img.attrs({ loading: "lazy" })`
	object-fit: contain;
	height: 100%;
	user-select: none;
`;

const AuthorLink = styled.a.attrs({ target: "_blank" })`
	color: rgb(0, 127, 255);
`;

const navigationButtons = css`
	${({ disabled }) =>
		disabled &&
		`
        opacity: 0;
        pointer-events: none;
    `}
	position: fixed;
	color: rgb(235 235 235);
	background-color: rgba(0, 0, 0, 0.5);
	width: 50px;
	height: 50px;
	cursor: pointer;
	margin: auto 0;
	z-index: 1000;
	transform: translateY(-50%);
	@media (max-width: 768px) {
		width: 35px;
		height: 35px;
	}
`;

const PreviousButton = styled(Icon).attrs({ path: mdiArrowLeft })`
	${navigationButtons}
	top: 50%;
	left: 30px;
	@media (max-width: 768px) {
		left: 15px;
	}
`;

const NextButton = styled(Icon).attrs({ path: mdiArrowRight })`
	${navigationButtons}
	top: 50%;
	right: 30px;
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

const Loading = styled(Icon).attrs({ path: mdiLoading, size: 3, spin: 1 })`
	color: rgb(235 235 235);
`;
