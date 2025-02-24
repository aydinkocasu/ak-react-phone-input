import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { countryData } from "./CountryData";
import "./AkPhoneInput.scss";
import { getExampleNumber, isValidNumber, validatePhoneNumberLength } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import Portal from "./AkPortal";
const CheveronSvg = _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round", className: "icon icon-tabler icons-tabler-outline icon-tabler-chevron-down", children: [_jsx("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }), _jsx("path", { d: "M6 9l6 6l6 -6" })] });
const getPhoneMask = (countryCode) => {
    const exampleNumber = getExampleNumber(countryCode, examples);
    if (!exampleNumber)
        return "";
    let formattedExample = exampleNumber.formatNational();
    if (formattedExample.startsWith("0")) {
        formattedExample = formattedExample.substring(1);
    }
    return formattedExample.replace(/\d/g, "0");
};
const applyMask = (mask, value) => {
    let masked = '';
    let rawIndex = 0;
    for (let x = 0; x < mask.length; x++) {
        if (rawIndex >= value.length)
            break;
        if (mask[x] === "0") {
            masked += value[rawIndex];
            rawIndex++;
        }
        else {
            masked += mask[x];
        }
    }
    return masked;
};
const AkPhoneInput = ({ onChange, defaultCountry = "US", radius = 4, mode = "light", variant = "default", noShadow = false, errorMessage = "Please enter valid phone number" }) => {
    var _a, _b, _c, _d, _e, _f;
    // Dropdown State
    const [isOpen, setIsOpen] = useState(false);
    // Country selection
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [mask, setMask] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [isValid, setIsValid] = useState(null);
    // Dropdown search Text
    const [searchText, setSearchText] = useState("");
    // Refs
    const [dropdownDirection, setDropdownDirection] = useState("down");
    const currentCode = useRef("");
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const caretPosRef = useRef(0);
    const inputRef = useRef(null);
    const _calculatePosition = () => {
        if (containerRef.current && dropdownRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - containerRect.bottom;
            const spaceAbove = containerRect.top;
            const dropdownHeight = 300;
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownDirection("up");
            }
            else {
                setDropdownDirection("down");
            }
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (!selectedCountry) {
            const index = countryData.findIndex(cd => cd.value === defaultCountry);
            if (index !== -1) {
                _handleOnClick(countryData[index]);
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
    const _handleKeyDown = (event) => {
        if (event.key === "Delete") {
            caretPosRef.current = event.currentTarget.selectionEnd || 0;
        }
        else {
            caretPosRef.current = 0;
        }
    };
    const _handleChange = (event) => {
        const inputText = event.target.value;
        const newRaw = inputText.replace(/\D/g, '');
        const newFormatted = applyMask(mask, newRaw);
        const isLenghtValid = validatePhoneNumberLength(newRaw, selectedCountry === null || selectedCountry === void 0 ? void 0 : selectedCountry.value);
        const isLocalValid = isValidNumber(newRaw, selectedCountry === null || selectedCountry === void 0 ? void 0 : selectedCountry.value);
        if (isLenghtValid === undefined) {
            if (isValid !== isLocalValid) {
                setIsValid(false);
            }
        }
        if (isLenghtValid === "TOO_LONG")
            return;
        if (isLenghtValid !== undefined) {
            if (isValid === false) {
                setIsValid(true);
            }
        }
        setFormattedValue(newFormatted);
        onChange({ value: `${currentCode.current} ${newRaw}`, isValid: isLocalValid });
    };
    useLayoutEffect(() => {
        if (inputRef.current) {
            if (caretPosRef.current !== 0) {
                const newCaretPos = Math.min(caretPosRef.current, formattedValue.length);
                inputRef.current.setSelectionRange(newCaretPos, newCaretPos);
            }
        }
    }, [formattedValue]);
    const _handleOnClick = (option) => {
        setIsValid(null);
        setSelectedCountry(option);
        setMask(getPhoneMask(option.value || "US"));
        currentCode.current = option.label.split("(")[0];
        setFormattedValue("");
        setIsOpen(false);
    };
    const filteredCountries = countryData.filter((country) => country.country_name.toLowerCase().includes(searchText.toLowerCase()));
    return (_jsxs("div", { className: `ak-phone-input-main ${variant} ${mode}`, children: [_jsxs("div", { ref: containerRef, className: `ak-phone-input-root ${isValid === false ? "error" : ""}`, style: { borderRadius: `${radius}px` }, children: [_jsxs("div", { className: "ak-country-select-box", onClick: () => setIsOpen((prev) => !prev), style: { borderRadius: `${radius}px 0px 0px ${radius}px` }, children: [_jsx("img", { className: "country-flag", src: selectedCountry === null || selectedCountry === void 0 ? void 0 : selectedCountry.flag, alt: selectedCountry === null || selectedCountry === void 0 ? void 0 : selectedCountry.country_name }), _jsxs("div", { className: "ak-phone-input-icon", children: [" ", CheveronSvg, " "] })] }), _jsxs("div", { className: "ak-country-code-and-input", children: [_jsxs("span", { className: "country-code", children: [" ", selectedCountry === null || selectedCountry === void 0 ? void 0 : selectedCountry.label.split("(")[0], " "] }), _jsx("input", { type: "text", ref: inputRef, className: "phone-input", value: formattedValue, onKeyDown: _handleKeyDown, onChange: (e) => _handleChange(e), placeholder: mask !== null && mask !== void 0 ? mask : "0000" })] }), _jsx(Portal, { children: _jsxs("div", { ref: dropdownRef, className: `ak-phone-input-dropdown ${isOpen && "open"} ${variant} ${mode} ${noShadow ? "no-sh" : ""}`, style: {
                                borderRadius: `${radius}px`,
                                position: "fixed",
                                width: (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width,
                                left: (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect().left,
                                top: dropdownDirection === "down" ? (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().bottom : "auto",
                                bottom: dropdownDirection === "up" ? window.innerHeight - ((_e = (_d = containerRef.current) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect().top) !== null && _e !== void 0 ? _e : 0) : "auto",
                            }, children: [_jsx("input", { style: { borderRadius: `${radius}px ${radius}px 0px 0px` }, onChange: (e) => { setSearchText(e.target.value); }, placeholder: "Search Country" }), _jsx("div", { className: "cs-scroll", style: { width: (_f = containerRef.current) === null || _f === void 0 ? void 0 : _f.getBoundingClientRect().width }, children: filteredCountries.map((option) => (_jsxs("div", { className: "cs-option", onClick: () => { _handleOnClick(option); }, children: [_jsx("img", { className: "country-flag", src: option === null || option === void 0 ? void 0 : option.flag, alt: option === null || option === void 0 ? void 0 : option.country_name }), option.country_name] }, option.value))) })] }) })] }), isValid === false && _jsx("span", { style: { color: "red" }, children: errorMessage })] }));
};
export default AkPhoneInput;
