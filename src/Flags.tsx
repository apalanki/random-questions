import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import codes from "./CountryCodes.json";
import { useSwipeable } from "react-swipeable";
// import CountryMap from './CountryMap';

interface Code {
  id: string;
  long_name: string;
  short_name: string;
  center_lat: string;
  center_lng: string;
  sw_lat: string;
  sw_lng: string;
  ne_lat: string;
  ne_lng: string;
}

const FLAG_ENDPOINT = "https://flagcdn.com";
/**
 * Available Sizes: 20, 40, 80, 160, 320, 640, 1280, 2560
 */
const SIZE = 320;

const shuffledCodes: Code[] = (codes as Code[])
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

function Flags() {
  const [number, setNumber] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const selectedState = shuffledCodes[number];
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setNumber((currentNumber) => {
        const previousNumber = currentNumber - 1;
        return previousNumber >= 0 ? previousNumber : currentNumber;
      }),
    onSwipedRight: () =>
      setNumber((currentNumber) => {
        setShowHint(false);
        const nextNumber = currentNumber + 1;
        return nextNumber < shuffledCodes.length ? nextNumber : currentNumber;
      }),
    onSwipedUp: () => setShowHint((currentHint) => !currentHint),
    onSwipedDown: () => setShowHint((currentHint) => !currentHint),
  });

  const myRef = React.useRef();

  const refPassThrough = (el: any) => {
    // call useSwipeable ref prop with el
    handlers.ref(el);

    // set myRef el so you can access it yourself
    myRef.current = el;
  };

  const handleKeyDown = useCallback((e: any): void => {
    if (e.code === "ArrowRight") {
      setShowHint(false);
      setNumber((currentNumber) => {
        const nextNumber = currentNumber + 1;
        return nextNumber < shuffledCodes.length ? nextNumber : currentNumber;
      });
      e.preventDefault();
    } else if (e.code === "ArrowLeft") {
      setShowHint(true);
      setNumber((currentNumber) => {
        const previousNumber = currentNumber - 1;
        return previousNumber >= 0 ? previousNumber : currentNumber;
      });
      e.preventDefault();
    } else if (["ArrowUp", "ArrowDown"].includes(e.code)) {
      setShowHint((currentHint) => !currentHint);
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="App" onKeyDown={handleKeyDown} ref={refPassThrough}>
      <header className="App-header">
        {showHint ? <p>{selectedState.long_name}</p> : null}
        <img
          src={`${FLAG_ENDPOINT}/w${SIZE}/${selectedState.short_name.toLowerCase()}.png`}
          srcSet={`${FLAG_ENDPOINT}/w${2 * SIZE}/${selectedState.short_name.toLowerCase()}.png 2x`}
          width={SIZE}
          className="App-logo"
          alt={selectedState.long_name}
        />
        {showHint ? (
          <p>
            {selectedState.short_name} ( {number + 1} of {codes.length} )
          </p>
        ) : null}
        {/* <CountryMap/> */}
      </header>
    </div>
  );
}

export default Flags;
