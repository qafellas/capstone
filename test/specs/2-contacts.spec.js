import { expect, browser } from '@wdio/globals'
import {getRandomNum} from '../utils/randomNum.js'
import LoginPage from '../pageobjects/login.page.js'
import HomePage from '../pageobjects/home.page.js'
import ContactsPage from '../pageobjects/contacts.page.js'

describe('Login Tests', () => {
    const contactFirstName = 'Ryan'
    const contactLastName = 'Holmes'
    const editedFirstName = 'Robert'
    const editedLastName = 'Hall'

    before('', async()=> {
        await LoginPage.open() 
        await LoginPage.initialize()
        await HomePage.initialize()
        await ContactsPage.initialize()
        await LoginPage.login( process.env.email, process.env.password )  
    })

    after('', async()=>{
        await HomePage.logoutBtn.click()
    })
    
    it('should create new contact', async () => {
        await HomePage.addContactBtn.click()
        await ContactsPage.addNewContact(contactFirstName, contactLastName)
        const newContactRow = ContactsPage.contactsTableRow
        await newContactRow.waitForDisplayed()
        expect(await newContactRow.isDisplayed()).toBe(true)
    })

    it('should edit existing contact', async () => {
        await ContactsPage.contactsTableRow.click()
        await ContactsPage.editContactBtn.click()
        await ContactsPage.firstNameBox.clearValue()
        await ContactsPage.firstNameBox.setValue(editedFirstName)
        await ContactsPage.lastNameBox.clearValue()
        await ContactsPage.lastNameBox.setValue(editedLastName)
        await ContactsPage.submitBtn.click()
        await ContactsPage.returnToContactList.click()
        await ContactsPage.contactsTableRow.waitForDisplayed()
        expect(await ContactsPage.contactFullName.getText()).toHaveText(editedFirstName + ' ' + editedLastName)
    })

    it('should delete existing contact', async () => {
        await ContactsPage.contactsTableRow.click()
        await ContactsPage.deleteContactBtn.click()
        const alertMessage = await browser.getAlertText()
        expect(alertMessage).toHaveText('Are you sure you want to delete this contact?')
        await browser.acceptAlert()
        expect(ContactsPage.contactsTableRow).not.toExist()
    })

    
})

