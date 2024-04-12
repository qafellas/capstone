import { $, browser } from '@wdio/globals'
import Page from './page.js'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SignUpPage extends Page {
    /**
     * Define selectors
     */
    async initialize() {
        this.firstNameBox = await $('//input[@placeholder="First Name"]')
        this.lastNameBox = await $('#lastName')
        this.emailBox = await $('#email')
        this.passwordBox = await $('#password')
        this.submitBtn = await $('//button[@id="submit"]')
        this.errorMsg = await $('#error')
    }

    async fillSignUpForm(email, password){
        await this.firstNameBox.waitForDisplayed()
        await this.firstNameBox.setValue('a')
        await this.lastNameBox.setValue('b')
        await this.emailBox.setValue(email)
        await this.passwordBox.setValue(password)
        await this.submitBtn.click()
    }
}

export default new SignUpPage()
