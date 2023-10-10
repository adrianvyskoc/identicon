import { generateMD5Hash, md5HexToDecimalList } from "./md5.js";
export class Identicon extends HTMLElement {
    constructor() {
        super();
        this.name = '';
        this.shape = 'rounded';
        this.decimals = [];
    }
    connectedCallback() {
        const name = this.getAttribute('name');
        const shape = this.getAttribute('shape');
        if (shape && !['rounded', 'square'].includes(shape)) {
            throw Error('Shape attribute must be one of: rounded, square');
        }
        if (!name) {
            throw Error('Name attribute is required');
        }
        this.name = name;
        this.decimals = md5HexToDecimalList(generateMD5Hash(name));
        this.render();
    }
    // TODO: implement decimals change logic
    render() {
        const color = `rgb(${this.decimals[0]}, ${this.decimals[1]}, ${this.decimals[2]})`;
        const identicon = document.createElement('div');
        identicon.classList.add('identicon');
        identicon.classList.add(`--${this.shape}`);
        debugger;
        for (const decimal of this.decimals) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (decimal % 2 === 0) {
                cell.style.backgroundColor = color;
            }
            identicon.appendChild(cell);
        }
        document.body.appendChild(identicon);
    }
}
