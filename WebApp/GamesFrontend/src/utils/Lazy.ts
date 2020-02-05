import React, { ComponentType, LazyExoticComponent } from "react";

const retry = (factory: () => any, retriesLeft = 5, interval = 200): Promise<any> => {
	return new Promise<JSX.Element>((resolve, reject) => {
		factory()
			.then(resolve)
			.catch((error: any) => {
				setTimeout(() => {
					if (retriesLeft === 1) {
						// reject('maximum retries exceeded');
						reject(error);
						return;
					}

					// Passing on "reject" is the important part
					retry(factory, retriesLeft - 1, interval).then(resolve, reject);
				}, interval);
			});
	});
};

function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T> {
	return React.lazy(() => retry(factory));
}

export default lazy;
