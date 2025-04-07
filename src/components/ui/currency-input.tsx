import { useState } from "react";
import type { ChangeEvent } from "react";
import { Input } from "./input";

export function InlineCurrencyInput({
  onChange,
  onBlur,
}: {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: string) => void;
}) {
  const [rawValue, setRawValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Format the value as Euro currency
  const formatAsCurrency = (
    value: string,
    withSymbol = true,
    withDots = true,
  ): string => {
    if (!value) return "";

    const number = Number.parseFloat(value);
    if (isNaN(number)) return "";

    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      currencyDisplay: withSymbol ? "symbol" : "code",
      useGrouping: withDots,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get input value and remove currency formatting
    const input = e.target.value.replace(/[^\d.]/g, "");
    setRawValue(input);

    // When focused, show the raw value for easier editing
    if (isFocused) {
      setDisplayValue(input);
    } else {
      setDisplayValue(formatAsCurrency(input));
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Show raw value when focused for easier editing
    setDisplayValue(rawValue);
    // Select all text when focused
    e.target.select();
  };

  const handleBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Format the value when the input loses focus
    setDisplayValue(formatAsCurrency(rawValue));
    onBlur?.(formatAsCurrency(rawValue, false).replace(",", "."));
  };

  return (
    <div className="w-full">
      <Input
        id="currency-input"
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="0,00 €"
      />
    </div>
  );
}

