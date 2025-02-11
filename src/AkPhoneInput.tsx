import { useEffect, useLayoutEffect, useRef, useState } from "react";
import React from "react"
import { CountryData, countryData } from "./CountryData";
import "./AkPhoneInput.scss"
import { CountryCode, getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import Portal from "./AkPortal";


interface CustomPhoneInputProps {
	onChange: (value: string) => void
	radius?: number,
	variant?: "default" | "filled"
	mode?: "light" | "dark"
	noShadow?: boolean
}

const CheveronSvg = <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>

const getPhoneMask = (countryCode: CountryCode) => {
	const exampleNumber = getExampleNumber(countryCode, examples);

	if (!exampleNumber) return "";

	let formattedExample = exampleNumber.formatNational();
	if (formattedExample.startsWith("0")) {
		formattedExample = formattedExample.substring(1);
	}
	return formattedExample.replace(/\d/g, "0");
}


const applyMask = (mask: string, value: string): string => {
	let masked = '';
	let rawIndex = 0;
	for (let x = 0; x < mask.length; x++) {
		if (rawIndex >= value.length) break;
		if (mask[x] === "0") {
			masked += value[rawIndex]
			rawIndex++;
		} else {
			masked += mask[x]
		}
	}
	return masked;
};


const AkPhoneInput = ({ onChange, radius = 4, mode = "light", variant = "default", noShadow = false }: CustomPhoneInputProps) => {
	// Dropdown State
	const [isOpen, setIsOpen] = useState(false);

	// Country selection
	const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
	const [mask, setMask] = useState<string>("");

	const [formattedValue, setFormattedValue] = useState("");

	// Dropdown search Text
	const [searchText, setSearchText] = useState<string>("")

	// Refs
	const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down");
	const currentCode = useRef<string>("")
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const caretPosRef = useRef<number>(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const _calculatePosition = () => {
		if (containerRef.current && dropdownRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - containerRect.bottom;
			const spaceAbove = containerRect.top;
			const dropdownHeight = 300;

			if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
				setDropdownDirection("up");
			} else {
				setDropdownDirection("down");
			}
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (!selectedCountry) {
			const index = countryData.findIndex(cd => cd.value === "US")
			if (index !== -1) {
				_handleOnClick(countryData[index])
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	useEffect(() => {
		if (isOpen) {
			_calculatePosition();
			window.addEventListener("resize", _calculatePosition);
		}
		return () => {
			window.removeEventListener("resize", _calculatePosition);
		};
	}, [isOpen]);

	const _handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Delete") {
			caretPosRef.current = event.currentTarget.selectionEnd || 0;
		} else {
			caretPosRef.current = 0
		}
	}

	const _handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputText = event.target.value;

		const newRaw = inputText.replace(/\D/g, '');

		const newFormatted = applyMask(mask, newRaw);
		setFormattedValue(newFormatted);
		onChange(`${currentCode.current} ${newRaw}`)
	};

	useLayoutEffect(() => {
		if (inputRef.current) {
			if (caretPosRef.current !== 0) {
				const newCaretPos = Math.min(caretPosRef.current, formattedValue.length);
				inputRef.current.setSelectionRange(newCaretPos, newCaretPos);
			}
		}
	}, [formattedValue]);

	const _handleOnClick = (option: CountryData) => {
		setSelectedCountry(option);
		setMask(getPhoneMask(option.value as CountryCode || "US"));
		currentCode.current = option.label.split("(")[0]
		setFormattedValue("")
		setIsOpen(false)
	}


	const filteredCountries = countryData.filter((country) =>
		country.country_name.toLowerCase().includes(searchText.toLowerCase())
	);


	return (
		<div ref={containerRef} className={`ak-phone-input-main ${variant} ${mode}`} >
			<div className="ak-phone-input-root" style={{ borderRadius: `${radius}px` }} >
				<div
					className="ak-country-select-box"
					onClick={() => setIsOpen(!isOpen)}
					style={{ borderRadius: `${radius}px 0px 0px ${radius}px` }}
				>
					{< img className="country-flag" src={selectedCountry?.flag} alt={selectedCountry?.country_name} />}
					<div className="ak-phone-input-icon" > {CheveronSvg} </div>
				</div>
				<div className="ak-country-code-and-input" >
					<span className="country-code"> {selectedCountry?.label.split("(")[0]} </span>
					<input
						type="text"
						ref={inputRef}
						className="phone-input"
						value={formattedValue}
						onKeyDown={_handleKeyDown}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => _handleChange(e)}
						placeholder={mask ?? "0000"}
					/>
				</div>
				<Portal>
					<div
						ref={dropdownRef}
						className={`ak-phone-input-dropdown ${isOpen && "open"} ${variant} ${mode} ${noShadow ? "no-sh" : ""}`}
						style={{
							borderRadius: `${radius}px`,
							position: "fixed",
							width: containerRef.current?.getBoundingClientRect().width,
							left: containerRef.current?.getBoundingClientRect().left,
							top: dropdownDirection === "down" ? containerRef.current?.getBoundingClientRect().bottom : "auto",
							bottom: dropdownDirection === "up" ? window.innerHeight - (containerRef.current?.getBoundingClientRect().top ?? 0) : "auto",
						}}
					>
						<input
							style={{ borderRadius: `${radius}px ${radius}px 0px 0px` }}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchText(e.target.value) }} placeholder="Search Country" />
						<div className="cs-scroll" style={{ width: containerRef.current?.getBoundingClientRect().width }}>
							{filteredCountries.map((option: CountryData) => (
								<div
									className="cs-option"
									key={option.value}
									onClick={() => { _handleOnClick(option) }}

								>
									<img
										className="country-flag"
										src={option?.flag}
										alt={option?.country_name}
									/>
									{option.country_name}
								</div>
							))}
						</div>
					</div>
				</Portal>
			</div>
		</div>
	);
};

export default AkPhoneInput
