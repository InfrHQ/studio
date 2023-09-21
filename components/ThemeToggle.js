"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	return (
		<button
			type="button"
			className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
			{theme === "dark" ? <SunIcon /> : <MoonIcon />}
		</button>
	);
}

export default ThemeToggle;
