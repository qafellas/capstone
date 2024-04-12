import { $, browser } from '@wdio/globals'
import Page from './page.js'
import {getRandomNum} from '../utils/randomNum.js'

class HomePage extends Page {
    /**
     * Define selectors
     */
    async initialize() {
        this.homePageTitle = await $('h1')
        this.addContactBtn = await $('#add-contact')
        this.logoutBtn = await $('#logout')
    }
}

export default new HomePage()
