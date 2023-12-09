import { $, $$ } from "@wdio/globals";
import { MobileHelper } from "../helper/mobileHelper";

class SearchResultPage {
	private get backButton() {
		return $('//android.widget.Button[@content-desc="Go back"]');
	}

	private get totalSearchResultCountText() {
		return $('//android.widget.TextView[contains(@text,"Total search results: ")]');
	}

	private get addToReadingList() {
		return $('(//android.widget.TextView[@text=""])[2]');
	}

	private get addToWishList() {
		return $('(//android.widget.TextView[@text=""])[1]');
	}

	private get searchResultListDisplay() {
		return $$("//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup");
	}

	private get searchResultPageElements() {
		return $$("//android.widget.ScrollView//android.widget.TextView");
	}

	private get searchResultBooksTitles() {
		return $$('//android.widget.TextView[contains(@text,"MacBook")]//parent::android.view.ViewGroup');
	}

	private get bookAuthorNameAndPublishYearOnSearchPage() {
		return $$('//android.widget.TextView[contains(@text,"MacBook")]//following-sibling::android.widget.TextView');
	}

	private get openBookDetailsPageElements() {
		return $$("//android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView");
	}

	private get currentlyReadingPageElements() {
		return $$('//android.widget.TextView[contains(@text,"")]');
	}

	private get progressBar() {
		return $("#android.widget.ProgressBar");
	}

	/**
	 * Purpose: Verifies if the user has navigated to the search result page by checking the presence of search results.
	 * Waits for the progress bar to disappear, then checks for the display of search result count,
	 * and finally verifies the number of books displayed on the search result page.
	 * @returns A Promise that resolves when the verification is complete or rejects if any assertion fails.
	 */
	async verifyUserNavigatedToSearchResultPage(): Promise<void> {
		//Arrage required functions
		await this.waitForProgressBarToDisappear();
		await this.totalSearchResultCountText.waitForDisplayed({ timeout: 30000 });
		//Perform Action
		const numberOfBooksDisplay: WebdriverIO.Element[] = await this.searchResultListDisplay;
		//Perform Assertion
		await expect(numberOfBooksDisplay).toBeElementsArrayOfSize({ gte: 0, lte: 5 });
	}

	/**
	 * Purpose: Opens the details of the first book from the search result.
	 * Clicks on the first book's title in the search result list,
	 * then waits for the progress bar to disappear indicating the page load completion.
	 */
	async openBookDetails(): Promise<void> {
		MobileHelper.clickOnIndexElement(await this.searchResultBooksTitles, 0);
		await browser.pause(2000); // This is to handel extreme slownees on my system, Pls ignore it's not recommended
		await this.waitForProgressBarToDisappear();
	}

	/**
	 * Purpose: Retrieves the details of books displayed on the search result page.
	 * Fetches the elements containing book titles, Author, Year from the search result,
	 * then returns an array of strings representing the book titles.
	 * @returns A Promise that resolves with an array of strings representing book titles.
	 */
	async fetchBookDetailsFromSearchScreen(): Promise<string[]> {
		const searchResultPageList: WebdriverIO.Element[] = await this.searchResultPageElements;
		const elementArrayTxt = await MobileHelper.getArrayElementsWithText(searchResultPageList);
		return elementArrayTxt;
	}

	/**
	 * Purpose: Retrieves the details of books displayed on the Currently Reading screen.
	 * Fetches the elements containing book title and other text
	 * then returns an array of strings representing the book title.
	 * @returns A Promise that resolves with an array of strings representing book titles.
	 */
	async fetchBookDetailsFromReadingList(): Promise<string[]> {
		const currentlyReadingPageList: WebdriverIO.Element[] = await this.currentlyReadingPageElements;
		const elementArrayTxt = await MobileHelper.getArrayElementsWithText(currentlyReadingPageList);
		return elementArrayTxt;
	}

	/**
	 * Fetches book details from the open book's details screen.
	 * Retrieve text elements related to the book details from the page
	 * and returns an array containing the text data.
	 * @returns A Promise that resolves with an array of strings representing book details.
	 */
	async fetchBookDetailsForOpenBook(): Promise<string[]> {
		const bookDetailsPageList: WebdriverIO.Element[] = await this.openBookDetailsPageElements;
		const elementArrayTxt = await MobileHelper.getArrayElementsWithText(bookDetailsPageList);
		return elementArrayTxt;
	}

	/**
	 * Checks if a searched book name exists within the search results.
	 * Validates the presence of the book name within the titles displayed in the search results.
	 * @param bookName The name of the book to search for within the search result titles.
	 */
	async checkIfBookNameExistsInSearchResults(bookName: string): Promise<void> {
		await MobileHelper.validateSearchResultList(await this.searchResultBooksTitles, bookName);
	}

	/**
	 * Updates the currently reading or wishlist based on the provided action.
	 * @param action The action to be performed ('ReadingList' for currently reading, else for wishlist).
	 */
	async updateCurrentlyReadingList(action: string): Promise<void> {
		try {
			if (!action) {
				throw new Error("Action parameter is null or undefined");
			}
			if (action=="ReadingList") {
	// This is not best practice to use browser.pause in code,(This is not recommended to use, Pls ignore)
	// I have added it to handle exterme slowness on system my emulator which was failing even though after
	// adding dynamic waits browser.waitUntil(() =>) on real device this may not be issue
				await browser.pause(3000);
				MobileHelper.addRemoveBookToList(await this.addToReadingList, action);
				await browser.pause(2000);
			} else {
				await browser.pause(3000);
				MobileHelper.addRemoveBookToList(await this.addToWishList, action);
				await browser.pause(2000);
			}
		} catch (e) {
			console.log("Execption occurred while Performing booklist update action" + e);
		}
	}

	/**
	 * Validates if the book title on the search page matches the book title on the details page.
	 * @param bookTitleOnSearchPage The book title displayed on the search page.
	 * @param bookTitleOnDetailsPage The book title displayed on the details page.
	 */
	async validateBookTitle(bookTitleOnSearchPage: string, bookTitleOnDetailsPage: string) {
		await expect(bookTitleOnSearchPage).toEqual(bookTitleOnDetailsPage);
	}

	/**
	 * Validates if the book author on the search page matches the book author on the details page.
	 * @param bookAuthorOnSearchPage The book author displayed on the search page.
	 * @param bookAuthorOnDetailsPage The book author displayed on the details page.
	 */
	async validateBookAuthor(bookAuthorOnSearchPage: string, bookAuthorOnDetailsPage: string) {
		await expect(bookAuthorOnSearchPage).toEqual(bookAuthorOnDetailsPage);
	}

	/**
	 * Validates if the book publishing year on the search page matches the one on the details page.
	 * @param bookPublishOnSearchPage The publishing year displayed on the search page.
	 * @param bookPublishOnDetailsPage The publishing year displayed on the details page.
	 */
	async validateBookPublishingYear(bookPublishOnSearchPage: string, bookPublishOnDetailsPage: string) {
		await expect(bookPublishOnSearchPage).toEqual(bookPublishOnDetailsPage);
	}

	/**
	 * Validates if the book summary label on the details page matches the expected label.
	 * @param bookSummarylabelOnDetailsPage The book summary label displayed on the details page.
	 */
	async validateBookSummaryLabel(bookSummarylabelOnDetailsPage: string) {
		await expect(bookSummarylabelOnDetailsPage).toEqual("Book Summary");
	}

	/**
	 * Validates if the book summary description on the details page contains a specific text snippet.
	 * @param bookSummaryDescOnDetailsPage The book summary description displayed on the details page.
	 */
	async validateBookSummaryDescription(bookSummaryDescOnDetailsPage: string) {
		await expect(bookSummaryDescOnDetailsPage).toContain("Learning how to use a new laptop can be as challenging");
	}

	/**
	 * Waits for the progress bar to disappear from the screen.
	 */
	async waitForProgressBarToDisappear() {
		MobileHelper.waitForProgressBarToDisappear(await this.progressBar);
	}

	/**
	 * Navigates to the previous screen by clicking the back button.
	 * This functions is error prone and may raise exception so handeld in try catch
	 */
	async navigateToBackScreen() {
		try {
	// This is not best practice to use browser.pause in code,(This is not recommended to use, Pls ignore)
	// I have added it to handel exterme slowness on my emulator which was failing even though after addeing dynamic wait in function
			await browser.pause(2000);
			MobileHelper.click(await this.backButton);
		} catch (e) {
			console.log("Execption occurred while Performing click to navigate button" + e);
		}
	}
}
export default new SearchResultPage();
