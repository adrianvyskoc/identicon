import { generateMD5Hash, md5HexToDecimalList } from "./md5.js";
export class Identicon extends HTMLElement {
    constructor() {
        super();
        this.name = '';
        this.shape = 'circle';
        this.decimals = [];
    }
    connectedCallback() {
        const name = this.getAttribute('name');
        const shape = this.getAttribute('shape');
        if (shape && !['circle', 'square'].includes(shape)) {
            throw Error('Shape attribute must be one of: circle, square');
        }
        if (!name) {
            throw Error('Name attribute is required');
        }
        this.name = name;
        this.shape = shape || 'circle';
        this.decimals = md5HexToDecimalList(generateMD5Hash(name));
        this.render();
    }
    attributeChangedCallback(name) {
        const rerenderOn = ['name', 'shape', 'decimals'];
        if (rerenderOn.includes(name)) {
            this.render();
        }
    }
    render() {
        const color = `rgb(${this.decimals[0]}, ${this.decimals[1]}, ${this.decimals[2]})`;
        const identicon = document.createElement('div');
        identicon.classList.add('identicon');
        identicon.classList.add(`--${this.shape}`);
        for (const decimal of this.decimals) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (decimal % 2 === 0) {
                cell.style.backgroundColor = color;
            }
            identicon.appendChild(cell);
        }
        const style = document.createElement("style");
        style.textContent = `
        identicon-avatar {
          display: inline-block;
        }

      .identicon {
        width: 5em;
        height: 5em;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
      }
      
      .identicon.--circle {
        border-radius: 100%;
        overflow: hidden;
      }
    `;
        const shadowDom = this.attachShadow({ mode: 'open' });
        shadowDom.appendChild(identicon);
        shadowDom.appendChild(style);
    }
}
