import { ButtonPlugin } from 'paella-core'

export default class TestButtonPlugin extends ButtonPlugin {
    async action() {
        console.log("Test");
    }
}