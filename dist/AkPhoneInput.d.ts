import "./AkPhoneInput.scss";
import { CountryCode } from "libphonenumber-js";
interface CustomPhoneInputProps {
    onChange: ({ value, isValid }: {
        value: string;
        isValid: boolean;
    }) => void;
    errorMessage?: string;
    radius?: number;
    variant?: "default" | "filled";
    mode?: "light" | "dark";
    noShadow?: boolean;
    defaultCountry?: CountryCode;
}
declare const AkPhoneInput: ({ onChange, defaultCountry, radius, mode, variant, noShadow, errorMessage }: CustomPhoneInputProps) => import("react/jsx-runtime").JSX.Element;
export default AkPhoneInput;
//# sourceMappingURL=AkPhoneInput.d.ts.map