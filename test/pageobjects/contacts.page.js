import { $, browser } from '@wdio/globals'
import Page from './page.js'
import {getRandomNum} from '../utils/randomNum.js'

class ContactsPage extends Page {
    /**
     * Define selectors
     */
    async initialize() {
        this.firstNameBox = await $('#firstName')
        this.lastNameBox = await $('#lastName')
        this.emailBox = await $('#email')
        this.birthDateBox = await $('#birthdate')
        this.phoneNumberBox = await $('#phone')
        this.addressBox = await $('#street1')
        this.aptNumBox = await $('#street2')
        this.cityBox = await $('#city')
        this.stateBox = await $('#stateProvince')
        this.postalCodeBox = await $('#postalCode')
        this.countryBox = await $('#country')
        this.submitBtn = await $('//button[@id="submit"]')
        this.contactsTableRow = await $('.contactTableBodyRow')
        this.editContactBtn = await $('#edit-contact')
        this.contactFullName = await $('.contactTableBodyRow td:nth-child(2)')
        this.returnToContactList = await $('#return')
        this.deleteContactBtn = await $('#delete')
    }

    async addNewContact(firstName, lastName){
        await this.firstNameBox.setValue(firstName)
        await this.lastNameBox.setValue(lastName)
        await this.birthDateBox.setValue('1990-05-04')
        await this.phoneNumberBox.setValue('4005681122')
        await this.emailBox.setValue(`${firstName}.${lastName}.${getRandomNum()}@gmail.com`)
        await this.addressBox.setValue('123 Main Street')
        await this.aptNumBox.setValue('55')
        await this.cityBox.setValue('Orlando')
        await this.stateBox.setValue('Florida')
        await this.postalCodeBox.setValue('32765')
        await this.countryBox.setValue('USA')
        await this.submitBtn.click()
    }
}

export default new ContactsPage()
