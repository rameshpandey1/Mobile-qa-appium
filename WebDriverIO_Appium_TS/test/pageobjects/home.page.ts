import { $ } from "@wdio/globals";
import { MobileHelper } from "../helper/mobileHelper";

class HomePage {
	private get inputTextBox() {
		return $("//android.widget.EditText");
	}

	private get openCurrentlyReadingText() {
		return $('//android.widget.TextView[@text="Currently Reading"]');
	}

	/**
	 * Searches for a book by name or ISBN using the provided search text.
	 * @param enterSearchText The text used for searching the book by name or ISBN.
	 */
	async searchBookByNameISBN(enterSearchText: any) {
		await this.inputTextBox.waitForDisplayed({ timeout: 30000 });
		MobileHelper.enterTextAndPressEnter(await this.inputTextBox, enterSearchText);
	}

	/**
	 * Opens the currently reading list by clicking on the readinglist UI element.
	 */
	async openCurrentlyReadingList() {
		MobileHelper.click(await this.openCurrentlyReadingText);
	}
}
export default new HomePage();
