import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Portal = ({ children }: { children: React.ReactNode }) => {
	const [portalContainer] = useState(() => document.createElement("div"));

	useEffect(() => {
		document.body.appendChild(portalContainer);
		return () => {
			document.body.removeChild(portalContainer);
		};
	}, [portalContainer]);

	return ReactDOM.createPortal(children, portalContainer);
};

export default Portal
