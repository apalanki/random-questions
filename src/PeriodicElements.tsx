import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import elements from "./elements.json";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSwipeable } from "react-swipeable";

interface Element {
  name: string;
  number: number;
  category: string;
  summary: string;
}

const shuffledElements: Element[] = (elements.elements as Element[])
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

function PeriodicElements() {
  const [number, setNumber] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(true);
  const selectedElement = shuffledElements[number];

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setNumber((currentNumber) => {
        const previousNumber = currentNumber - 1;
        return previousNumber >= 0 ? previousNumber : currentNumber;
      }),
    onSwipedRight: () =>
      setNumber((currentNumber) => {
        const nextNumber = currentNumber + 1;
        return nextNumber < shuffledElements.length
          ? nextNumber
          : currentNumber;
      }),
    onSwipedUp: () => setShowHint((currentHint) => !currentHint),
    onSwipedDown: () => setShowHint((currentHint) => !currentHint),
  });

  useEffect(() => {
    setShowHint(false);
  }, [number]);

  const handleKeyDown = useCallback((e: any): void => {
    if (e.code === "ArrowRight") {
      setNumber((currentNumber) => {
        const nextNumber = currentNumber + 1;
        return nextNumber < shuffledElements.length
          ? nextNumber
          : currentNumber;
      });
      e.preventDefault();
    } else if (e.code === "ArrowLeft") {
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

  const myRef = React.useRef();
  const refPassThrough = (el: any) => {
    // call useSwipeable ref prop with el
    handlers.ref(el);

    // set myRef el so you can access it yourself
    myRef.current = el;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="App" onKeyDown={handleKeyDown} ref={refPassThrough}>
      <header className="App-header">
        {showHint ? (
          <Box sx={{ minWidth: 275 }} style={{ padding: "40px" }}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {selectedElement.category}
                </Typography>
                <Typography variant="h3" component="div">
                  <p className="Element-name">
                    {selectedElement.number}. {selectedElement.name}
                  </p>
                </Typography>
                <Typography variant="body1">
                  {selectedElement.summary}
                </Typography>
                <Typography variant="body2">
                  {number + 1} of {shuffledElements.length}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <p className="Element-number">{selectedElement.number}</p>
        )}
      </header>
    </div>
  );
}

export default PeriodicElements;
