import { describe, it, expect, beforeAll } from 'vitest';
import { Identicon } from './identicon';

beforeAll(() => {
  if (!customElements.get('identicon-avatar')) {
    customElements.define('identicon-avatar', Identicon);
  }
});

describe('Identicon', () => {
  it('creates a shadow root when connected with a valid name', () => {
    const el = document.createElement('identicon-avatar') as Identicon;
    el.setAttribute('name', 'test');
    document.body.appendChild(el);

    expect(el.shadowRoot).not.toBeNull();

    document.body.removeChild(el);
  });

  it('throws when name attribute is missing', () => {
    const el = new Identicon();
    expect(() => el.connectedCallback()).toThrow('Name attribute is required');
  });

  it('throws when shape attribute is invalid', () => {
    const el = new Identicon();
    el.setAttribute('name', 'test');
    el.setAttribute('shape', 'triangle');
    expect(() => el.connectedCallback()).toThrow('Shape attribute must be one of: circle, square');
  });

  it('renders cell elements inside the shadow root', () => {
    const el = document.createElement('identicon-avatar') as Identicon;
    el.setAttribute('name', 'test');
    document.body.appendChild(el);

    const cells = el.shadowRoot?.querySelectorAll('.cell');
    expect(cells?.length).toBeGreaterThan(0);

    document.body.removeChild(el);
  });

  it('applies circle class for circle shape', () => {
    const el = document.createElement('identicon-avatar') as Identicon;
    el.setAttribute('name', 'test');
    el.setAttribute('shape', 'circle');
    document.body.appendChild(el);

    const identicon = el.shadowRoot?.querySelector('.identicon');
    expect(identicon?.classList.contains('--circle')).toBe(true);

    document.body.removeChild(el);
  });

  it('applies square class for square shape', () => {
    const el = document.createElement('identicon-avatar') as Identicon;
    el.setAttribute('name', 'test');
    el.setAttribute('shape', 'square');
    document.body.appendChild(el);

    const identicon = el.shadowRoot?.querySelector('.identicon');
    expect(identicon?.classList.contains('--square')).toBe(true);

    document.body.removeChild(el);
  });

  it('defaults to circle shape when shape is not specified', () => {
    const el = document.createElement('identicon-avatar') as Identicon;
    el.setAttribute('name', 'test');
    document.body.appendChild(el);

    expect(el.shape).toBe('circle');

    document.body.removeChild(el);
  });
});
