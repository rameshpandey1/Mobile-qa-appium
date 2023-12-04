import { Element as WebdriverIO, Key } from "webdriverio";
import { $, expect, browser } from "@wdio/globals";

export class MobileHelper {
	/**
	 * Waits for a progress bar identified by the provided selector to disappear from the screen
	 * @param selector - The selector for the progress bar element to wait for.
	 */
	static async waitForProgressBarToDisappear(selector: WebdriverIO.Element): Promise<void> {
		if (!selector) {
			throw new Error("Invalid selector provided");
		}
		const progressBar = await $(selector);

		if (await progressBar.isDisplayed()) {
			progressBar.waitUntil(() => !progressBar.isDisplayed(), {
				timeout: 40000,
				timeoutMsg: "Progressbar not disappear within given time frame",
				interval: 1000
			});
		} else {
			console.log("Progressbar not found on the screen, proceeding to next step");
		}
	}

	/**
	 * This function is used to perform action on book based on supplied action type "ReadingList/WishList"
	 * @param selector:  Element reference to interact with
	 * @param action : action to perform on book
	 */
	static async addRemoveBookToList(selector: WebdriverIO.Element, action: string) {
		await $(selector).waitForDisplayed({ timeout: 30000 });
		const performAction = action;
		switch (performAction) {
			case "ReadingList":
				await $(selector).click();
				break;

			case "WishList":
				await $(selector).click();
				break;

			default:
				// Handle a default case if none of the specified cases match
				console.log("No matching action found");
				break;
		}
	}

	/**
	 * This function is used to store books titles and validate the book search result
	 * @param selector : Element reference to interact with
	 * @param bookName : Book name search keyword
	 * return true/false based on validation
	 */
	static async validateSearchResultList(selector: WebdriverIO.Element[], bookName: string): Promise<boolean> {
		try {
			if (!selector || bookName.trim() === "") {
				throw new Error("Invalid input parameters");
			}
			const productTitles = await $$(selector);
			const bookTitles: string[] = [];
			for (const titleElement of productTitles) {
				bookTitles.push(await titleElement.getText());
			}

			for (const title of bookTitles) {
				expect(title.toLowerCase()).toHaveText(bookName.toLowerCase());
			}
			return true;
		} catch (e) {
			console.log(e);
			return false; // Validation failed due to error
		}
	}

	/**
	 * Clicks on the specified element using given WebDriverIO Element.
	 * @param selector - The WebDriverIO Element to click.
	 * @returns Promise<void> - Resolves when the click action is completed.
	 */
	static async click(selector: WebdriverIO.Element): Promise<void> {
		const element = await $(selector);
		await element.click();
	}

	/**
	 * Clicks on the element at the specified index within the provided WebDriverIO Element array.
	 * @param selector - Array of WebDriverIO Elements.
	 * @param index - Index of the element within the array to click.
	 * @returns Promise<void> - Resolves when the click action is completed.
	 */
	static async clickOnIndexElement(selector: WebdriverIO.Element[], index: number): Promise<void> {
		const element = await $$(selector);
		await element[index].click();
	}

	/**
	 * Enters the specified text into the provided element using its WebDriverIO Element.
	 * @param selector - The WebDriverIO Element where text will be entered.
	 * @param text - Text to be entered into the element.
	 * @returns Promise<void> - Resolves when text input is completed.
	 */
	static async enterText(selector: WebdriverIO.Element, text: string): Promise<void> {
		const element = await $(selector);
		await element.setValue(text);
	}

	/**
	 * Enters the specified text into the provided element and simulates pressing the Android 'Enter' key using WebDriverIO BrowserObject.
	 * @param selector - The WebDriverIO Element where text will be entered.
	 * @param textToEnter - Text to be entered into the element.
	 * @returns Promise<void> - Resolves when text input and 'Enter' key presses are completed.
	 */
	static async enterTextAndPressEnter(selector: WebdriverIO.Element, textToEnter: string): Promise<void> {
		await browser.keys(Key.Clear);
		const element = await $(selector);
		await element.setValue(textToEnter);
		await browser.keys(Key.Enter);
		await browser.keys(Key.Enter);
	}

	/**
	 * Retrieves text content from the specified element, splits it using the provided delimiter,
	 * and returns the text at the specified index of the resulting array.
	 * @param selector - The WebDriverIO Element from which text will be retrieved.
	 * @param delimiter - The string to use as a delimiter to split the text.
	 * @param index - The index of the text within the resulting array to return.
	 * @returns Promise<string> - Resolves with the text at the specified index after splitting.
	 */
	static async getTextSpiltAtIndex(selector: WebdriverIO.Element, delimeter: string, index: number): Promise<string> {
		const text = await $(selector).getText();
		const textArray = text.split(delimeter);
		console.log(textArray);
		return textArray[index];
	}

	/**
	 * Retrieves text content from an array of WebdriverIO Elements and returns an array of strings representing their text.
	 * @param selector - Array of WebdriverIO Elements to extract text from.
	 * @returns Promise<string[]> - Resolves with an array of strings containing the text from the elements.
	 */
	static async getArrayElementsWithText(selector: WebdriverIO.Element[]): Promise<string[]> {
		const bookArrayELements: string[] = [];
		for (const titleElement of selector) {
			bookArrayELements.push(await titleElement.getText());
		}
		console.log(bookArrayELements);
		return bookArrayELements;
	}

	/**
	 * Performs a click on a WebdriverIO Element using JavaScript execution.
	 * @param selector - The WebdriverIO Element to click using JavaScript.
	 * @returns Promise<void> - Resolves when the click action is completed.
	 */
	static async clickUsingJavaScript(selector: WebdriverIO.Element): Promise<void> {
		await browser.execute("arguments[0].click();", selector);
	}

	/**
	 * Waits for a WebdriverIO Element to become visible within a specified timeout period.
	 * @param selector - The WebdriverIO Element to wait for visibility.
	 * @param timeout - Optional timeout duration in milliseconds (default: 30000ms).
	 * @returns Promise<void> - Resolves when the element becomes visible or the timeout is reached.
	 */
	static async waitForElementVisible(selector: WebdriverIO.Element, timeout: number = 30000): Promise<void> {
		const element = await $(selector);
		await element.waitForDisplayed({ timeout });
	}

	/**
	 * Scrolls the webpage to bring a specific element into view based on the provided selector.
	 * @param selector - The selector identifying the element to scroll into view.
	 * @returns Promise<void> - Resolves when the scrolling action is completed.
	 */
	static async scrollIntoView(selector: string): Promise<void> {
		const bottomElementSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text(${selector})`;
		const bottomEl = $(`android=${bottomElementSelector}`);
	}

	/**
	 * This function hides the keyboard in the driver context.
	 * WebdriverIO and Appium, both driver and browser are instances of the WebdriverIO browser object and can be used interchangeably.
	 * The choice between using driver or browser name is largely a matter of personal preference and the naming conventions the team have decided to follow.
	 * @returns Promise<void> - Resolves when the keyboard is hidden.
	 */
	static async hideKeyBoard(): Promise<void> {
		browser.hideKeyboard();
	}

	/**
	 * Performs a swipe action in the specified direction on the WebDriverIO Browser instance.
	 * @param driver - The WebDriverIO Browser instance where the swipe action will be performed.
	 * @param direction - The direction of the swipe action: "up", "down", "left", or "right".
	 * @returns Promise<void> - Resolves when the swipe action is completed.
	 */
	static async swipe(direction: "up" | "down" | "left" | "right") {
		const { width, height } = await driver.getWindowSize();
		let startX: number, startY: number, endX: number, endY: number;

		switch (direction) {
			case "up":
				startX = width / 2;
				endX = startX;
				startY = (height * 3) / 4;
				endY = height / 4;
				break;
			case "down":
				startX = width / 2;
				endX = startX;
				startY = height / 4;
				endY = (height * 3) / 4;
				break;
			case "left":
				startY = height / 2;
				endY = startY;
				startX = (width * 3) / 4;
				endX = width / 4;
				break;
			case "right":
				startY = height / 2;
				endY = startY;
				startX = width / 4;
				endX = (width * 3) / 4;
				break;
		}

		const actions = [
			{
				type: "pointer",
				id: "finger1",
				parameters: { pointerType: "touch" },
				actions: [
					{ type: "pointerMove", duration: 0, x: startX, y: startY },
					{ type: "pointerDown" },
					{ type: "pause", duration: 100 }, // Duration of press
					{ type: "pointerMove", duration: 600, x: endX, y: endY }, // Duration of swipe
					{ type: "pointerUp" }
				]
			}
		];

		await browser.performActions(actions);
	}
}
