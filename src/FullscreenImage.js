import { useState, useEffect } from "react";
import styled from "styled-components";

export default function FullscreenImage({
	image = {},
	forwardRef,
	goToPreviousImage,
	goToNextImage,
}) {
	function keyHandler(e) {
		if (e.key === "ArrowRight") {
			console.log("go next");
			goToNextImage();
		} else if (e.key === "ArrowLeft") {
			console.log("go previous");
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
				<Image src={image.urls.regular} />
			</Container>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	transform: translate(-50%, -50%);
	background-color: rgb(0, 0, 0, 0.25);
	position: fixed;
	width: 100%;
	height: 100%;
	left: 50%;
	top: 50%;
	z-index: 100;
`;

const Container = styled.div`
	width: 80%;
	height: 80%;
`;

const Overlay = styled.div``;

const Image = styled.img.attrs({ loading: "lazy" })`
	width: 100%;
	height: 100%;
`;
