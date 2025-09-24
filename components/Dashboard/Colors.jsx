import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";

const themes = {
  dark: {
    background: "#0d0d0d",
    headings: "#ffffff",
    position: "#d5e4fd",
    text: "#d1d5db",
    border: "#1e1e1e",
    buttons: "#2563EB",
  },
  light: {
    background: "#ffffff",
    headings: "rgb(55, 55, 55)",
    position: "#666666",
    text: "#666666",
    border: "#E5E5E5",
    buttons: "rgb(20, 20, 20)",
  },
  blue: {
    background: "#030712",
    headings: "#ffffff",
    position: "#d5e4fd",
    text: "#d1d5db",
    border: "#111824",
    buttons: "#2563EB",
  },
  green: {
    background: "#e8e8e3",
    headings: "#151513",
    position: "#8a8a71",
    text: "#6d665f",
    border: "#D9D9D8",
    buttons: "#3e3b37",
  },
};

export default function ColorPalette({ onColorChange }) {
  const [selectedColor, setSelectedColor] = useState("#0d0d0d");
  const [showPicker, setShowPicker] = useState(false);
  const [colorType, setColorType] = useState("background");
  const [colors, setColors] = useState(themes.dark);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cachedColors = localStorage.getItem("colors");

    if (cachedColors) {
      const parsedColors = JSON.parse(cachedColors);
      setColors(parsedColors);
      setSelectedColor(parsedColors.background);
      setIsLoaded(true);
    } else {
      fetchColors();
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      onColorChange(colors);
    }
  }, [colors, isLoaded, onColorChange]);

  const fetchColors = async () => {
    try {
      const response = await fetch("/api/colors");
      const data = await response.json();
      if (data.colors) {
        const fetchedColors = {
          background: data.colors.backgroundColor || themes.dark.background,
          headings: data.colors.headingColor || themes.dark.headings,
          position: data.colors.positionColor || themes.dark.position,
          text: data.colors.textColor || themes.dark.text,
          border: data.colors.borderColor || themes.dark.border,
          buttons: data.colors.buttonsColor || themes.dark.buttons,
        };
        setColors(fetchedColors);
        setSelectedColor(fetchedColors.background);
        localStorage.setItem("colors", JSON.stringify(fetchedColors));
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handleColorClick = (type) => {
    setSelectedColor(colors[type]);
    setColorType(type);
    setShowPicker(true);
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  const handleColorChange = (color) => {
    const newColor = color.hex;
    const updatedColors = { ...colors, [colorType]: newColor };
    setColors(updatedColors);
    setSelectedColor(newColor);

    fetch("/api/colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ colors: updatedColors }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("colors", JSON.stringify(updatedColors));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const applyTheme = async (theme) => {
    const selectedTheme = themes[theme];
    setColors(selectedTheme);
    setSelectedColor(selectedTheme.background);

    try {
      const response = await fetch("/api/colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ colors: selectedTheme }),
      });
      const data = await response.json();
      localStorage.setItem("colors", JSON.stringify(selectedTheme));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <div className="w-full gap-2 flex flex-col whitespace-nowrap relative px-[1px] mt-5">
      {/* Color Palette Section */}
      <div className="mb-4">
        <p className="text-muted text-md sm:text-sm mb-2">Color Palette</p>
        <div className="w-full h-min grid grid-cols-6 gap-2">
          {Object.keys(colors).map((type) => (
            <div
              key={type}
              className="hover:opacity-80 h-9 border cursor-pointer rounded-lg"
              style={{ backgroundColor: colors[type] }}
              onClick={() => handleColorClick(type)}
            ></div>
          ))}
        </div>
      </div>

      {/* Themes Section */}
      <div className="">
        <p className="text-muted text-md sm:text-sm mb-2">Themes presets</p>
        <div className="flex gap-2 ">
          {Object.keys(themes).map((theme) => (
            <div
              key={theme}
              className="w-full hover:opacity-90 flex flex-col items-center pt-2 h-32 border cursor-pointer rounded-lg"
              style={{ backgroundColor: themes[theme].background }}
              onClick={() => applyTheme(theme)}
            >
              <div
                className="w-4 h-4 mb-2 rounded-lg"
                style={{ backgroundColor: themes[theme].headings }}
              ></div>
              <div
                className="h-2 w-3/5 rounded-lg-t-full"
                style={{ backgroundColor: themes[theme].headings }}
              ></div>
              <div
                className="h-1 w-3/5 rounded-lg-b-full"
                style={{ backgroundColor: themes[theme].border }}
              ></div>
              <div className="w-3/5 mb-2">
                <div className="flex w-full gap-1 mt-2 rounded-lg overflow-hidden">
                  <div className="w-full flex flex-col">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: themes[theme].headings }}
                    ></div>
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: themes[theme].border }}
                    ></div>
                  </div>
                </div>
                <div className="flex w-full gap-1 mt-2 rounded-lg overflow-hidden">
                  <div className="w-full flex flex-col">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: themes[theme].headings }}
                    ></div>
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: themes[theme].border }}
                    ></div>
                  </div>
                </div>
                <div className="flex w-full gap-1 mt-2 rounded-lg overflow-hidden">
                  <div className="w-full flex flex-col">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: themes[theme].headings }}
                    ></div>
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: themes[theme].border }}
                    ></div>
                  </div>
                </div>
              </div>
              <div
                className="h-3 w-3/5 rounded-lg"
                style={{ backgroundColor: themes[theme].buttons }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      {showPicker && (
        <div className="absolute bottom-[250px] mt-4 left-0 w-full max-w-xs">
          <div className="flex flex-col ">
            <div className="mb-4">
              <ChromePicker
                color={selectedColor}
                onChangeComplete={handleColorChange}
              />
            </div>
            <button
              className="bg-black hover:opacity-90 h-9 text-sm text-white w-[225px] rounded-lg px-4 py-2"
              onClick={handleClosePicker}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
