import { useState, useEffect } from "react";

export default function useImage(src) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const [fetching, setFetching] = useState(false);

	useEffect(() => {
		if (!src) {
			return;
		}

		setFetching(true);
		setLoaded(false);
		setError(false);

		const image = new Image();
		image.src = src;

		function handleError() {
			setError(true);
			setFetching(false);
		}

		function handleLoad() {
			setLoaded(true);
			setError(false);
			setFetching(false);
		}

		image.onerror = handleError;
		image.onload = handleLoad;

		return () => {
			image.removeEventListener("error", handleError);
			image.removeEventListener("load", handleLoad);
		};
	}, [src]);

	return { loaded, error, fetching };
}
