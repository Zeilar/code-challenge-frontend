import {
	mdiArrowRight,
	mdiArrowLeft,
	mdiClose,
	mdiLoading,
	mdiDownload,
} from "@mdi/js";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Icon from "@mdi/react";
import useImage from "./useImage";
import fileDownload from "js-file-download";
import dayjs from "dayjs";
import { button } from "./styled-components";

export default function FullscreenImage({
	image = {},
	forwardRef,
	goToPreviousImage,
	goToNextImage,
	previousImage,
	nextImage,
	close,
}) {
	const { loaded, fetching, error } = useImage(image.urls.regular);

	if (error) {
		alert("Error loading image");
	}

	const [imageFlipped, setImageFlipped] = useState(false);
	const [downloading, setDownloading] = useState(false);

	function keyHandler(e) {
		switch (e.key) {
			case "ArrowRight":
				return goToNextImage();
			case "ArrowLeft":
				return goToPreviousImage();
			case "ArrowDown":
			case "ArrowUp":
				return toggleFlip();
			case "Escape":
				return close();
		}
	}

	function toggleFlip() {
		setImageFlipped((p) => !p);
	}

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = null;
		};
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", keyHandler);
		return () => {
			document.removeEventListener("keydown", keyHandler);
		};
	}, [image]);

	async function saveImage(e) {
		e.stopPropagation();
		setDownloading(true);
		const response = await fetch(image.urls.raw);
		const blob = await response.blob();
		setDownloading(false);
		if (blob) {
			fileDownload(blob, `${image.id}.jpg`);
		} else {
			alert("Error downloading file");
		}
	}

	return (
		<Wrapper>
			<ImageContainer ref={forwardRef}>
				<CloseButton onClick={close} />
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
							onClick={toggleFlip}
							src={image.urls.regular}
							title={image.alt_description}
							alt={image.alt_description}
							imageFlipped={imageFlipped}
						/>
						<ImageMeta
							src={image.urls.regular}
							imageFlipped={imageFlipped}
							onClick={toggleFlip}
						>
							<DownloadButton
								onClick={saveImage}
								disabled={downloading}
							>
								{downloading ? (
									"Please wait..."
								) : (
									<>
										<DownloadButtonIcon />
										Download
									</>
								)}
							</DownloadButton>
							<MetaCenter>
								<MetaCenterLeft>
									<MetaCenterLeftItem>
										Author
									</MetaCenterLeftItem>
									<MetaCenterLeftItem>
										Date
									</MetaCenterLeftItem>
									<MetaCenterLeftItem>
										Likes
									</MetaCenterLeftItem>
									<MetaCenterLeftItem>
										Dimensions
									</MetaCenterLeftItem>
								</MetaCenterLeft>
								<MetaCenterRight>
									<MetaCenterRightItem>
										{image.user.username}
									</MetaCenterRightItem>
									<MetaCenterRightItem>
										{dayjs(image.created_at).format(
											"YYYY-MM-DD"
										)}
									</MetaCenterRightItem>
									<MetaCenterRightItem>
										{image.likes}
									</MetaCenterRightItem>
									<MetaCenterRightItem>
										{image.width} x {image.height}
									</MetaCenterRightItem>
								</MetaCenterRight>
							</MetaCenter>
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

/* Layout */
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
const flippable = css`
	backface-visibility: hidden;
	transition: 0.4s;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.75);
`;
const Image = styled.img.attrs({ loading: "lazy" })`
	${flippable}
	transform: perspective(2000px) rotateY(0);
	object-fit: cover;
	height: 100%;
	${({ imageFlipped }) =>
		imageFlipped && "transform: perspective(2000px) rotateY(-180deg);"}
`;
const ImageContainer = styled.article`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	max-height: 80%;
`;

/* Image meta */
const ImageMeta = styled.aside`
	${flippable}
	user-select: none;
	transform: perspective(2000px) rotateY(180deg);
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgb(235 235 235);
	background-size: cover;
	background-position: center;
	background-image: url("${({ src }) => src}");
	color: rgb(235 235 235);
	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.75);
		z-index: -1;
	}
	${({ imageFlipped }) =>
		imageFlipped && "transform: perspective(2000px) rotateY(0);"}
`;
const MetaCenter = styled.div`
	display: flex;
	position: relative;
	align-items: center;
`;
const metaCenterColumn = css`
	display: flex;
	flex-direction: column;
	position: absolute;
`;
const metaCenterItem = css`
	padding: 8px 12px;
	margin-bottom: 8px;
	font-size: 1.5rem;
	white-space: nowrap;
	&:last-child {
		margin-bottom: 0;
	}
	@media (max-width: 768px) {
		font-size: 0.85rem;
		padding: 4px 8px;
		margin-bottom: 5px;
	}
`;
const MetaCenterLeft = styled.div`
	${metaCenterColumn}
	right: 0;
`;
const MetaCenterLeftItem = styled.p`
	${metaCenterItem}
	border-right: 2px solid rgb(235 235 235);
	text-align: right;
	left: 0;
`;
const MetaCenterRight = styled.div`
	${metaCenterColumn}
`;
const MetaCenterRightItem = styled.p`
	${metaCenterItem}
	text-align: left;
`;

/* Navigation & interactives */
const navigationButtons = css`
	${({ disabled }) =>
		disabled &&
		`
        opacity: 0;
        pointer-events: none;
    `}
	position: fixed;
	color: rgb(235 235 235);
	background-color: rgba(0, 0, 0, 0.85);
	width: 50px;
	height: 50px;
	cursor: pointer;
	margin: auto 0;
	z-index: 1000;
	transform: translateY(-50%);
	&:focus,
	&:hover {
		outline: 2px solid rgb(235 235 235);
	}
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
const DownloadButton = styled.button`
	${button}
	display: flex;
	align-items: center;
	position: absolute;
	top: 15px;
	right: 15px;
	border: 0;
	color: rgb(235 235 235);
	background-color: rgba(0, 0, 0, 0.85);
	&:hover:not([disabled]) {
		outline: 2px solid rgb(235 235 235);
	}
	&[disabled] {
		cursor: wait;
	}
`;
const DownloadButtonIcon = styled(Icon).attrs({ path: mdiDownload })`
	width: 1rem;
	height: 1rem;
	margin-right: 5px;
`;
