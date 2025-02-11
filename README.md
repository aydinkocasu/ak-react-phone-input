# ak-react-phone-input

`AkPhoneInput` is a React component for rendering a phone input field with country code selection. It provides an easy-to-use interface for users to input phone numbers, format them according to selected country codes, and automatically display the country's flag and code.

## Installation

To install the `ak-react-phone-input` package, run the following command:

```bash
npm install ak-react-phone-input
```

Usage

Here's an example of how to use the AkPhoneInput component:

```
import React, { useState } from 'react';
import AkPhoneInput from 'ak-react-phone-input';

const MyComponent = () => {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  return (
    <div>
      <AkPhoneInput onChange={handlePhoneChange} />
      <p>Phone Number: {phone}</p>
    </div>
  );
};
```

## AkPhoneInput Component Documentation

### Props

| Prop Name     | Type                           | Default   | Description                                                                 |
| ------------- | ------------------------------ | --------- | --------------------------------------------------------------------------- |
| `onChange`    | `(value: string) => void`       | Required  | Callback function that is called whenever the phone number input changes.  |
| `radius`      | `number`                        | `4`       | The border radius for the input and dropdown (in pixels).                   |
| `variant`     | `"default"` or `"filled"`          | `"default"` | The variant of the input, either `"default"` or `"filled"`.                 |
| `mode`        | `"light" or "dark"`              | `"light"` | The theme mode for the component, either `"light"` or `"dark"`.             |
| `noShadow`    | `boolean`                       | `false`   | Whether the input should have a shadow or not.                              |

### Component Internal Behavior

| Feature                          | Description                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Country Selection**             | Users can select a country from a dropdown list, which automatically updates the country code and flag.                                                      |
| **Phone Mask**                    | Based on the selected country, the phone number input will be masked in a format appropriate for that country.                                                  |
| **Phone Number Formatting**       | As users input their phone number, it is automatically formatted according to the mask for the selected country.                                               |
| **Responsive Dropdown**           | The country dropdown opens either upwards or downwards depending on available space in the viewport.                                                           |

### Key Features

| Feature                          | Description                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Country Flag and Code**         | Displays the flag and country code of the selected country, making it easy for users to identify the country.                                                  |
| **Searchable Country Dropdown**   | Users can search through available countries, making it quicker to find the country they need.                                                                 |
| **Input Masking**                 | Automatically formats phone numbers based on the selected country's phone number format.                                                                      |

### Styling Customization

| Style            | Description                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `borderRadius`   | Customize the input's corner radius.                                                              |
| `variant`        | Choose between a `"default"` or `"filled"` input style.                                           |
| `mode`           | Choose between `"light"` or `"dark"` theme for the component.                                     |
| `noShadow`       | Disable input shadow if set to `true`.                                                            |


To override the default styles, you can add custom CSS in your project:

```css
.ak-phone-input-main {
  // Your custom styles
}

.ak-phone-input-root {
  // Your custom styles
}
```

Example

```ts
import AkPhoneInput from 'ak-react-phone-input';
import { useState } from 'react';

const MyForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };

  return (
    <div>
      <AkPhoneInput onChange={handlePhoneChange} variant="filled" mode="dark" />
      <p>Selected Phone Number: {phoneNumber}</p>
    </div>
  );
};

export default MyForm;
```

License
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
