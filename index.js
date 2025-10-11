class CreditFooter extends HTMLElement {
  static get observedAttributes() {
    return ['button-color'];
  }
  static {
    customElements.define('credit-footer', CreditFooter);
  }
  constructor() {
    super();

    // Register the custom property at runtime so animations can interpolate it
    // even when the styles live inside the shadow DOM. Some browsers only
    // properly register custom property syntax/types when registered via the
    // CSS.registerProperty API or from document-level styles.
    if (typeof CSS !== 'undefined' && 'registerProperty' in CSS) {
      try {
        CSS.registerProperty({
          name: '--angle',
          syntax: '<angle>',
          inherits: false,
          initialValue: '0deg'
        });
      } catch (e) {
        // ignore if already registered
      }
    }

    this.attachShadow({ mode: 'open' });
    this.opened = false;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'button-color' && this.shadowRoot) {
      const btn = this.shadowRoot.querySelector('.toggle-btn');
      if (btn) btn.style.color = newValue || 'black';
    }
  }

  toggle() {
    this.opened = !this.opened;
    const sector = this.shadowRoot.querySelector('.sector');

    this.classList.toggle('open', this.opened);
    if (this.opened) {
      setTimeout(() => sector.classList.add('open'), 400);
    } else {
      sector.classList.remove('open');
    }
  }

  render() {
    const html = (strings, ...values) =>
      strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');

    this.shadowRoot.innerHTML = html`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');

        :host {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: block;
          z-index: 9999;
          --half-sector-angle: 64deg;
          --sector-radius: 200px;
        }

        .sector {
          position: relative;
          margin: auto;
          width: calc(var(--sector-radius) * 2);
          aspect-ratio: 1;
          translate: 0 15%;
          background: radial-gradient(circle at 50% 50%,
              #1d0819 15%,
              #bfcfc4 25%,
              #bfcfc4 40%,
              #c1b8ca 50%,
              #b4b1c6 60%,
              #b4b1c6 100%);
          mask: conic-gradient(#ff4e50 0deg var(--angle), transparent var(--angle) 360deg);
          rotate: calc(var(--half-sector-angle) * -1);
          border-radius: 50%;
          opacity: 0;
          filter: url(#noiseTexture);
        }

        .sector.links {
          position: absolute;
          left: 0;
          top: 0;
          transition: opacity 0.4s ease 0.4s;
        }

        @keyframes reveal {
          from {
            --angle: 0deg;
            opacity: 0;
          }

          to {
            --angle: calc(var(--half-sector-angle) * 2);
            opacity: 1;
          }
        }

        .sector.open {
          animation: reveal 0.3s ease-out forwards;
        }

        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background: rgba(20, 20, 25, 0.7);
          backdrop-filter: blur(20px);
          transform-origin: bottom center;
          transition:
            height 0.6s cubic-bezier(0.25, 1, 0.5, 1),
            transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          overflow: hidden;
          display: flex;
        }

        :host(.open) .footer {
          height: 100vh;
          transform: scaleY(1);
        }

        .toggle-btn {
          max-width: 160px;
          position: fixed;
          bottom: 2rem;
          left: 50%;
          translate: -50%;
          color: var(--btn-color, black);
          border: none;
          cursor: pointer;
          background: transparent;
          z-index: 10000;
          mix-blend-mode: difference;
          transition: all 0.15s ease;
        }

        .toggle-btn:active {
          transform: scale(0.95);
        }

        .links {
          position: absolute;
          bottom: 50%;
          left: 50%;
          translate: 170% 0;
          display: flex;
          justify-content: center;
        }

        :host(.open) .toggle-btn {
          filter: invert(1);
        }

        :host(.open) .footer .links {
          opacity: 1;
        }

        a:hover {
          transform: scale(1.15);
        }

        .sector-link {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(0, -50%);
          transform-origin: 1rem center;
          color: #adcbb6;
          padding: 0;
          font-size: 0.8rem;
          text-decoration: none;
          font-family: sans-serif;
          filter: brightness(1.2);
          letter-spacing: 0.05em;
          position: absolute;
        }

        .sector-link::after {
          content: '';
          display: block;
          height: 1.2px;
          width: 0;
          background: currentColor;
          transition: width 0.3s cubic-bezier(.4,0,.2,1);
          margin-top: 2px;
        }

        .sector-link:hover::after {
          width: 100%;
        }
      </style>

      <svg viewBox="0 0 602.29 163.75">
        <defs>
          <style>
            #author path,
            #author circle {
              fill: currentColor;
              mix-blend-mode: difference;
            }
          </style>
          <symbol id="author">
            <path
              d="M592.27,0C589.94,10.78,576,10.78,569.11,21c-6.83-5-13.62-7.38-25.41-5.38-9.13,25.54-5.38,120.37,11.17,129.13,8.37,5.78,20.58-1.83,29.78-3,5.39,10.79,11,14,17.64,22-24.77-7.44-25-6.7-75.09-16.75,5.91-15.88-2.1-34.74.26-40.29S531.61,90,531.61,90C525,88.81,520,88.82,514,91c-2.51,24.41-6.32,41,7.56,56l-42.85-4c22.06-8.59,32.26-77.52,18.75-106-3.58-7.55-7.66-7.93-18.75-13l39.71-8c-12.36,14.94-3.79,40.59-2.89,45.47s-6,9-1.07,14.09S526.59,80,530,74.73s-.73-10-3.4-15.3c-3.83-6.72,4-45.43,4-45.43Z" />
            <path
              d="M20.26,5.7c23.92,2.8,43.37,16.75,68,9v1l-24,30c-7,23.41,13.89,47,16,63,3.08,23.36-32.37,39.57-47,47-38.31-6.53-47.66-77.3-6-88v1c-25.51,20.07-8.93,78.75,31,70l5-6c9.31-17.66-17.72-52.3-15-74,1.12-8.87,12.32-15.75,17-22l-50-14c3,8.44,12.58,10.85,17,19l-7,20h-2c.15-17-7.66-14.62-15-23C8.05,24.32,14.62,15,20.26,5.7Z" />
            <path
              d="M306.26,33.7c14.72-.05,25.53-.75,33.33-.49-6,1.89-16.23,7.06-20.37,17.24-4.82,11.87,6.48,58,10,65.25,3,6,10.3,7.46,13,15-11.38-5.79-23.75-9.6-38-5,3.5-11.94,13.6-31.83,4-50-13.19,12.88-.05-.1-14,13L280.55,68.05c-8.23,24.45-3,44.62,4.71,57.65l-41.12,3.65c1.71-2.69,26.26-8.14,23.93-71.46-.42-11.17-14.82-21.14-14.81-21.19l23.36-.33L294.93,68.7Z" />
            <circle cx="389.42" cy="79.94" r="6.37" />
            <path
              d="M256.26,59.7c-5.6-9.45-12.89-14-23-18-3.7-8.35-1.61-4.64-6-14l-3,14c-23.48,6.15-38.72,41.85-21,66,5.31,7.23,20.89,14.29,20.89,14.29a90.47,90.47,0,0,1,4.91,10.68L235,120.93C248.5,115.45,275.28,91.8,256.26,59.7Zm-27.11,56.62c-33.27.51-25.68-69.92-1-69.41S262.41,115.81,229.15,116.32Z" />
            <path
              d="M420.51,67.82c10-21.44,22.75-30.12,22.75-30.12C417.49,39.19,406,23.86,379.8,31S349.65,25.28,328,42c6.35,12.79,14.41,61.17,4.29,73.75l13,14c32.09-1.81,84.81,3.25,88.95-5.35s-23.73-35.09-13.7-56.53ZM380,31.91c2.69-.59,10.79.46,11.85,5.44,1,4.74-1.44,8.43-7.39,10.91,0,0-9.68.88-11.16-5.31s3.88-9.72,6.7-11Zm22.8,87c-6.49-1.19-6.6-5.63-6.8-8.07s-.59-7.9,4.28-7.11,4.61,5,2,9c6-1.11,6.42-4.41,7-8.57s-10.13-12.46-17.69-3.42c-12.92,15.44,7.39,19.6,1.56,28-7.52-4.54-9.63-8.86-7.87-20-8.29,4.89-8.56,16.12-20.59,16.21s-6.07-5.41-14.76-15c-3.75-4.13.77-14.26-1.65-19.25,6.43-2.46,22.2-4,34.74,3.53-4.94-6.91-7.19-16.26-3.41-24.08-9.54,9.25-18.68,10.55-31.33,10.55L345,49.64c15.21-2,29.61,5.55,39.5-.83,0,0,15.43-5.12,25.2.66-3.2,16.69-12.41,18.23-12.41,18.23,4.83,4.88,6.19,16,2.38,24.06,0,0,9.82,1.14,12.62,6.94,5.15,10.66-2.44,21.47-9.48,20.18Z" />
            <path
              d="M179.26,88.7c1.47-2.58,7.79-10.5,12.27-25,2.75-3.07,4.2-2.68,6.94-4.47a22.43,22.43,0,0,1-7.37-4.09c-7.12-15.73-14-12.42-38.84-17.41-6.67-6.63-9.44-12-23-10-26,3.92-29.16,12-57,10,6.24,17.45,15.78,51.9,10,77l-9,21c15.44-2.63,40.29-6,62.35-7l-11.18-8.86c-9.08,6.55-14.47,7.55-27.17,4.87-4.66-8.2-6.38-21.59-4-32,6.95-8.75,27.8-4.15,40-3,0,0-4.59-5.24-5.79-10.34s4.79-8.86,4.79-12.66c-9,3.26-25.55,12.39-38,8-2.75-8.41-5.8-16.42-5.2-28.61,17.27-3.65,42.72,9.7,60.06-2.18,3.95,0,9.74,69.71-11.73,84.59,30.48-.87,33.77.91,41.84,2.14-11.45-14.14-18-9.29-16-39.94h7c4.79,16.51,18.52,25.56,20.53,38.8l31.47,3.2C219.34,126.89,191.09,116.64,179.26,88.7Zm-52.4-40.91c-2.91-.08-8.17-5-8.39-9.64a8.69,8.69,0,0,1,5.76-8.89C131,28.69,135.33,31,136,37.64S129.89,47.88,126.86,47.79Zm35.4,34.91c.34-11,.26-21.79.59-32.79C196.2,50.32,170.85,82.7,162.26,82.7Z" />
            <path
              d="M228.85,64c3,5.87,1.78,11.93,14.41,17.71-11.19,4.57-11.47,12.63-13.56,16-2.49-2.76-3.33-11-13.44-15C226.14,76.42,227,70.26,228.85,64Z" />
            <path
              d="M489.22,60.59c-5.6-9.45-12.9-14-23-18-3.7-8.35-1.62-4.64-6-14l-3,14c-23.48,6.15-38.72,41.85-21,66,5.3,7.23,20.88,14.28,20.88,14.28A91,91,0,0,1,462,133.56L468,121.82C481.46,116.34,508.24,92.69,489.22,60.59ZM462.1,117.21c-33.26.51-25.68-69.92-.94-69.41s34.2,68.9.94,69.41Z" />
            <path
                  d="M461.8,64.88c2.95,5.87,1.78,11.93,14.42,17.71-11.2,4.56-11.48,12.63-13.57,16-2.48-2.77-3.33-11-13.43-15C459.09,77.31,459.93,71.15,461.8,64.88Z" />
          </symbol>
        </defs>
       
      </svg>

      <svg width="0" height="0">
        <filter id="noiseTexture" x="0" y="0" width="100%" height="100%">
          <!-- 生成噪声 -->
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2"
            numOctaves="2"
            seed="3"
            result="noise"
          />

          <!-- 将噪声转为灰度 -->
          <feColorMatrix
            in="noise"
            type="matrix"
            values="
              0.33 0.33 0.33 0 0
              0.33 0.33 0.33 0 0
              0.33 0.33 0.33 0 0
              0    0    0    1 0"
            result="grayNoise"
          />

          <!-- 控制透明度，让噪声柔和 -->
          <feComponentTransfer in="grayNoise" result="softNoise">
            <!-- slope 越小越透明 -->
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>

          <!-- 混合噪声与原图 -->
          <feBlend in="SourceGraphic" in2="softNoise" mode="soft-light" />
        </filter>
      </svg>


      <button class="toggle-btn">
        <svg width="120" viewBox="0 0 602.29 163.75">
          <use href="#author" />
        </svg>
      </button>
      <div class="footer">
        <div class="sector">
          <a class="sector-link" href="#" data-angle="1.2" data-radius="180">Github</a>
          <a class="sector-link" href="#" data-angle="64" data-radius="140">X(Twitter)</a>
          <a class="sector-link" href="#" data-angle="127" data-radius="140">CodePen</a>
        </div>
      </div>
    `;

    const btn = this.shadowRoot.querySelector('.toggle-btn');
    btn.onclick = () => this.toggle();
    // 初始化按钮颜色
    const btnColor = this.getAttribute('button-color');
    if (btnColor) btn.style.color = btnColor;

    const links = this.shadowRoot.querySelectorAll('.sector-link');
    links.forEach(link => {
      const angle = parseFloat(link.getAttribute('data-angle') || '0');
      const radius = parseFloat(link.getAttribute('data-radius') || '120');
      link.style.transform = `translate(${radius}px, -50%)`;
      link.style.rotate = `${angle - 90}deg`;
      if (angle < 64) {
        link.style.transform = `translate(${radius}px, -50%) rotate(180deg)`;
      }

      if (angle > 10 && angle < 118) {
        link.style.transformOrigin = 'left center';
      }
    });
  }
}