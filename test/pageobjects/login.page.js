import { $, browser } from '@wdio/globals'
import Page from './page.js'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * Define selectors
     */
    async initialize() {
        this.emailBox = await $('#email')
        this.passwordBox = await $('#password')
        this.submitBtn = await $('//button[@id="submit"]')
        this.signUpBtn = await $('#signup')
        this.errorMsg = await $('#error')
    }

    async login (username, password) {
        await this.emailBox.waitForDisplayed()
        await this.emailBox.setValue(username)
        await this.passwordBox.setValue(password)
        await this.submitBtn.click()
    }

    async open () {
        await super.open()
    }
}

export default new LoginPage()
