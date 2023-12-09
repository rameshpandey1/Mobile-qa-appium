import HomePage from "../pageobjects/home.page";
import ResultPage from "../pageobjects/searchResultPage";

const searchKeyword = "MacBook";
const ISBN = 9781119775669;

describe("Search Boook using BookName/ISBN and perform validations", () => {
	it("Search Book By ISBN and validate user navigated to search result page", async () => {
		await HomePage.searchBookByNameISBN(ISBN);
		await ResultPage.verifyUserNavigatedToSearchResultPage();
		await ResultPage.navigateToBackScreen();
	});

	it("Search Book By BookName and validate navigated to search result page", async () => {
		await HomePage.searchBookByNameISBN(searchKeyword);
		await ResultPage.verifyUserNavigatedToSearchResultPage();
	});

	it("Verify Book Search results contains matching results", async () => {
		await ResultPage.checkIfBookNameExistsInSearchResults(searchKeyword);
	});
});

describe("Adding Book to List (WishList,Currently Reading) from search result screen", async () => {
	it("Adding Book to Currently Reading List from search result screen", async () => {
		await ResultPage.updateCurrentlyReadingList("ReadingList");
	});

	it("Adding Book to WishList from search result screen", async () => {
		await ResultPage.updateCurrentlyReadingList("WishList");
	});

	it("Access Currently Reading BookList and verify if book title is matching with search screen book records.using book details index", async () => {
		const bookTitleOnSearchPage = await ResultPage.fetchBookDetailsFromSearchScreen();
		await HomePage.openCurrentlyReadingList();
		await ResultPage.waitForProgressBarToDisappear();
		const bookTitleOnCurrentlyReadingPage = await ResultPage.fetchBookDetailsFromReadingList();
		await ResultPage.validateBookTitle(bookTitleOnSearchPage[0], bookTitleOnCurrentlyReadingPage[4]);
	});
});

describe("Remove Books from Reading, Wish list and perform validations", async () => {
	let bookTitleOnCurrentlyReadingPage: string[];

	it("Remove Book from Currently Reading List Screen", async () => {
		bookTitleOnCurrentlyReadingPage = await ResultPage.fetchBookDetailsFromReadingList();
		await ResultPage.updateCurrentlyReadingList("ReadingList");
		await ResultPage.navigateToBackScreen();
		await ResultPage.waitForProgressBarToDisappear();
	});

	it("Remove Book from Currently Reading List from search result screen and validate it's removed from reading list", async () => {
		await ResultPage.updateCurrentlyReadingList("ReadingList");
		await HomePage.openCurrentlyReadingList();
		expect(bookTitleOnCurrentlyReadingPage[4]).not.toBeDisplayed();
		await ResultPage.navigateToBackScreen()
	});

	it("Removing Book from WishList from search result screen", async () => {
		await ResultPage.updateCurrentlyReadingList("WishList");
	});
});

describe("Open Book details and perform validations for all the details present on screen ", async () => {
	let bookDetailsPageData: string[];

	it("Open Book and verify Book details displayed and compare it with search result Book details ", async () => {
		const searchResultData = await ResultPage.fetchBookDetailsFromSearchScreen();
		await ResultPage.openBookDetails();
		bookDetailsPageData = await ResultPage.fetchBookDetailsForOpenBook();
		await ResultPage.validateBookTitle(searchResultData[0], bookDetailsPageData[0]);
		await ResultPage.validateBookAuthor(searchResultData[1], bookDetailsPageData[1]);
		await ResultPage.validateBookPublishingYear(searchResultData[2], bookDetailsPageData[2]);
		await ResultPage.validateBookSummaryLabel(bookDetailsPageData[3]);
		await ResultPage.validateBookSummaryDescription(bookDetailsPageData[4]);
	});

	it("Adding Book to Currently Reading List from open Book details screen and validate Book Title", async () => {
		await ResultPage.updateCurrentlyReadingList("ReadingList");
		await HomePage.openCurrentlyReadingList();
		await ResultPage.waitForProgressBarToDisappear();
		const bookTitleOnCurrentlyReadingPage = await ResultPage.fetchBookDetailsFromReadingList();
		await ResultPage.validateBookTitle(bookDetailsPageData[0], bookTitleOnCurrentlyReadingPage[4]);
		await ResultPage.navigateToBackScreen();
	});
});
